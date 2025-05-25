import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { gateway } from "@vercel/ai-sdk-gateway";
import { v4 as uuidv4 } from "uuid";
import { ProjectStore } from "@/lib/data-store";

export async function POST(req: NextRequest) {
    try {
        const { projectId, revisionPrompt, baseVersionId } = await req.json();

        if (!projectId || !revisionPrompt || !baseVersionId) {
            return NextResponse.json({ error: "Project ID, revision prompt, and base version ID are required" }, { status: 400 });
        }

        if (typeof revisionPrompt !== "string" || revisionPrompt.trim().length === 0) {
            return NextResponse.json({ error: "Revision prompt must be a non-empty string" }, { status: 400 });
        }

        // Get the project and base version
        const project = await ProjectStore.get(projectId);
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Find the base version
        const baseVersion = project.versions?.find((v) => v.id === baseVersionId);
        if (!baseVersion) {
            return NextResponse.json({ error: "Base version not found" }, { status: 404 });
        }

        // Generate revision ID
        const revisionId = uuidv4();

        // Create new revision version
        const newVersion = await ProjectStore.createRevision(projectId, {
            id: revisionId,
            revisionPrompt: revisionPrompt.trim(),
            baseVersionId,
            generatedHtml: "",
            status: "generating",
        });

        // Enhanced prompt for revision
        const enhancedPrompt = `You are revising an existing website. Here's the current HTML:

${baseVersion.generatedHtml}

User feedback for revision: "${revisionPrompt}"

Requirements:
- Modify the existing HTML based on the user's feedback
- Keep the same overall structure but implement the requested changes
- Maintain responsive design and modern styling
- Ensure the changes are well-integrated with the existing design
- Generate ONLY the complete updated HTML code, no explanations or markdown formatting
- Make sure to preserve any good elements while implementing the requested changes

Generate the complete updated HTML document:`;

        try {
            // Use Vercel AI Gateway to generate revised HTML
            const result = streamText({
                model: gateway("anthropic/claude-v3-haiku"),
                prompt: enhancedPrompt,
                temperature: 0.7,
            });

            // Collect the streamed response
            let generatedHtml = "";

            for await (const chunk of result.textStream) {
                generatedHtml += chunk;
            }

            // Clean up the generated HTML
            generatedHtml = generatedHtml
                .replace(/```html/g, "")
                .replace(/```/g, "")
                .trim();

            // Ensure we have valid HTML
            if (!generatedHtml.includes("<!DOCTYPE html>") && !generatedHtml.includes("<html")) {
                generatedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Revised Website</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="container">
        ${generatedHtml}
    </div>
</body>
</html>`;
            }

            // Update the new version with generated HTML
            await ProjectStore.updateVersion(newVersion.id, {
                generatedHtml,
                status: "completed",
            });

            return NextResponse.json({
                success: true,
                versionId: newVersion.id,
                versionNumber: newVersion.versionNumber,
                generatedHtml,
                message: "Website revision generated successfully!",
            });
        } catch (aiError) {
            console.error("AI Generation Error:", aiError);

            // Update version status to failed
            await ProjectStore.updateVersion(newVersion.id, { status: "failed" });

            return NextResponse.json({ error: "Failed to generate website revision. Please try again." }, { status: 500 });
        }
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

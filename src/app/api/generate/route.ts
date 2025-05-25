import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { gateway } from "@vercel/ai-sdk-gateway";
import { v4 as uuidv4 } from "uuid";
import { ProjectStore } from "@/lib/data-store";

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
            return NextResponse.json({ error: "Prompt is required and must be a non-empty string" }, { status: 400 });
        }

        // Generate project ID
        const projectId = uuidv4();

        // Create project with first version
        const newProject = await ProjectStore.create({
            id: projectId,
            prompt: prompt.trim(),
            generatedHtml: "",
            status: "generating",
        });

        // Enhanced prompt for better HTML generation
        const enhancedPrompt = `Create a complete, responsive HTML website based on this description: "${prompt}"

Requirements:
- Generate a complete HTML document with DOCTYPE, head, and body
- Include responsive CSS using Tailwind CSS classes or inline styles
- Make it mobile-friendly and visually appealing
- Include semantic HTML structure
- Add appropriate meta tags and title
- Use modern CSS Grid/Flexbox for layouts
- Include hover effects and smooth transitions
- Make it production-ready
- Ensure accessibility with proper alt tags, ARIA labels, and semantic elements
- Use professional color schemes and typography
- Include a favicon link (use a generic one)

Generate ONLY the complete HTML code, no explanations or markdown formatting.`;

        try {
            // Use Vercel AI Gateway to generate HTML
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

            // Clean up the generated HTML (remove any markdown formatting)
            generatedHtml = generatedHtml
                .replace(/```html/g, "")
                .replace(/```/g, "")
                .trim();

            console.log(generatedHtml);

            // Ensure we have valid HTML
            if (!generatedHtml.includes("<!DOCTYPE html>") && !generatedHtml.includes("<html")) {
                generatedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
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

            // Update the project's first version with generated HTML
            if (newProject.activeVersion) {
                await ProjectStore.updateVersion(newProject.activeVersion.id, {
                    generatedHtml,
                    status: "completed",
                });
            }

            return NextResponse.json({
                success: true,
                projectId,
                generatedHtml,
                message: "Website generated successfully!",
            });
        } catch (aiError) {
            console.error("AI Generation Error:", aiError);

            // Update project status to failed
            if (newProject.activeVersion) {
                await ProjectStore.updateVersion(newProject.activeVersion.id, { status: "failed" });
            }

            return NextResponse.json({ error: "Failed to generate website. Please try again." }, { status: 500 });
        }
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Get all projects (for demo purposes)
export async function GET() {
    const allProjects = await ProjectStore.getAll();

    return NextResponse.json({
        projects: allProjects,
    });
}

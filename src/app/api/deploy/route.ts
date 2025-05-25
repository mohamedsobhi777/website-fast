import { NextRequest, NextResponse } from "next/server";
import { deployHtmlToEdgeOne } from "@/lib/deployment";
import { ProjectStore } from "@/lib/data-store";

export async function POST(req: NextRequest) {
    try {
        const { projectId, versionId } = await req.json();

        if (!projectId) {
            return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
        }

        // Get the project
        const project = await ProjectStore.get(projectId);
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Determine which version to deploy
        let htmlToDeploy: string;
        let deployingVersionNumber: number;

        if (versionId) {
            // Deploy specific version
            const version = project.versions?.find((v) => v.id === versionId);
            if (!version) {
                return NextResponse.json({ error: "Version not found" }, { status: 404 });
            }
            htmlToDeploy = version.generatedHtml || "";
            deployingVersionNumber = version.versionNumber;
        } else {
            // Deploy active version
            if (!project.activeVersion?.generatedHtml) {
                return NextResponse.json({ error: "No HTML content to deploy" }, { status: 400 });
            }
            htmlToDeploy = project.activeVersion.generatedHtml;
            deployingVersionNumber = project.activeVersion.versionNumber;
        }

        if (!htmlToDeploy.trim()) {
            return NextResponse.json({ error: "HTML content is empty" }, { status: 400 });
        }

        try {
            // Deploy to EdgeOne Pages
            const deploymentUrl = await deployHtmlToEdgeOne(htmlToDeploy);

            return NextResponse.json({
                success: true,
                deploymentUrl,
                versionNumber: deployingVersionNumber,
                message: `Website v${deployingVersionNumber} deployed successfully!`,
            });
        } catch (deployError) {
            console.error("Deployment Error:", deployError);

            return NextResponse.json(
                {
                    error: deployError instanceof Error ? deployError.message : "Failed to deploy website. Please try again.",
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

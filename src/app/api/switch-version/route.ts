import { NextRequest, NextResponse } from "next/server";
import { ProjectStore } from "@/lib/data-store";

export async function POST(req: NextRequest) {
    try {
        const { projectId, versionId } = await req.json();

        if (!projectId || !versionId) {
            return NextResponse.json({ error: "Project ID and version ID are required" }, { status: 400 });
        }

        // Verify project exists
        const project = await ProjectStore.get(projectId);
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Verify version exists and belongs to project
        const version = project.versions?.find((v) => v.id === versionId);
        if (!version) {
            return NextResponse.json({ error: "Version not found or does not belong to this project" }, { status: 404 });
        }

        // Switch to the specified version
        const success = await ProjectStore.switchVersion(projectId, versionId);

        if (!success) {
            return NextResponse.json({ error: "Failed to switch version" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Switched to version ${version.versionNumber}`,
            versionId,
            versionNumber: version.versionNumber,
        });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

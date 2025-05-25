import { NextRequest, NextResponse } from "next/server";
import { ProjectStore } from "@/lib/data-store";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Await params before accessing properties
        const { id: projectId } = await params;

        if (!projectId) {
            return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
        }

        const project = await ProjectStore.get(projectId);

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            project,
        });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
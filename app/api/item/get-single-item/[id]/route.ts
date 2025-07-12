// app/api/item/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/item/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        level: true, // include level info (name, id)
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}

// app/api/levels/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust this import based on your prisma setup

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const level = await prisma.level.create({
      data: { name },
    });

    return NextResponse.json({ success: true, level });
  } catch (error) {
    console.error("Error creating level:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ad79383f-81e0-4217-ade9-45e3aa09c1e8

// 4d613e44-240b-4c3d-848d-480134ec8540

// 068e4041-d389-4cae-86a4-918fca01c851

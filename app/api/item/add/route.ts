// app/api/items/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Update path if your prisma client is elsewhere

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      itemCode,
      name,
      images,
      description,
      instructions,
      category,
      price,
      originalPrice,
      level,
      levelId,
      numberOfPieces,
      color,
      material,
      recommendedAge,
      size,
      weight,
      itemsInBox,
      totalItemsSold,
      brand,
      manufacturer,
      countryOfOrigin,
      rating,
      totalReviews,
      isAvailable,
      isPitara,
      isPopular,
      IsLovedByKids,
    } = data;

    // Basic required field check
    if (
      !itemCode ||
      !name ||
      !images ||
      !description ||
      !category ||
      !price ||
      !originalPrice ||
      !level ||
      !levelId ||
      !numberOfPieces ||
      !color ||
      !material ||
      !size ||
      !weight ||
      !itemsInBox ||
      !manufacturer ||
      !countryOfOrigin
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newItem = await prisma.item.create({
      data: {
        itemCode,
        name,
        images,
        description,
        instructions,
        category,
        price,
        originalPrice,
        level,
        levelId,
        numberOfPieces,
        color,
        material,
        recommendedAge,
        size,
        weight,
        itemsInBox,
        totalItemsSold,
        brand,
        manufacturer,
        countryOfOrigin,
        rating,
        totalReviews,
        isAvailable,
        isPitara,
        isPopular,
        IsLovedByKids,
      },
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}

// app/api/items/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// AWS S3 Configuration
const s3 = new S3Client({
  region: process.env.AMPLIFY_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AMPLIFY_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AMPLIFY_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const getField = (name: string) => formData.get(name)?.toString() || "";

    const itemCode = getField("itemCode");
    const name = getField("name");
    const description = getField("description");
    const instructions = getField("instructions");
    const category = getField("category");
    const price = parseFloat(getField("price"));
    const originalPrice = parseFloat(getField("originalPrice"));
    const levelId = getField("levelId");
    const numberOfPieces = getField("numberOfPieces");
    const color = getField("color");
    const material = getField("material");
    const recommendedAge = getField("recommendedAge");
    const size = getField("size");
    const weight = getField("weight");
    const itemsInBox = getField("itemsInBox");
    const totalItemsSold = getField("totalItemsSold");
    const brand = getField("brand");
    const manufacturer = getField("manufacturer");
    const countryOfOrigin = getField("countryOfOrigin");
    const totalReviews = getField("totalReviews");
    const rating = getField("rating");

    const files = formData.getAll("images") as File[];

    const imageUrls: string[] = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileKey = `items/${uuidv4()}_${file.name}`;
      const Bucket = process.env.AMPLIFY_BUCKET as string;

      const uploadCommand = new PutObjectCommand({
        Bucket,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
      });
      await s3.send(uploadCommand);

      const imageUrl = `https://${process.env.AMPLIFY_BUCKET!}.s3.${process.env
        .AMPLIFY_AWS_REGION!}.amazonaws.com/${fileKey}`;
      console.log("imageUrl", imageUrl);
      imageUrls.push(imageUrl);
    }

    console.log(
      itemCode,
      name,
      description,
      instructions,
      category,
      price,
      originalPrice,
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
      rating,
      manufacturer,
      countryOfOrigin,
      totalReviews
    );

    const item = await prisma.item.create({
      data: {
        itemCode,
        name,
        description,
        instructions,
        category,
        price,
        originalPrice,
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
        images: imageUrls,
      },
    });
    console.log(item);
    return NextResponse.json({ success: true, message: "success" });
  } catch (error) {
    console.error("Error uploading item:", error);
    return NextResponse.json(
      { error: "Failed to upload item" },
      { status: 500 }
    );
  }
}

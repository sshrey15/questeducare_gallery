import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import cloudinary from 'cloudinary';

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, images } = body;

    if (!title || !images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { message: "Title and at least one image are required" },
        { status: 400 }
      );
    }

    // Fixed Cloudinary upload code
    const imageLinks = await Promise.all(
      images.map(async (image) => {
        try {
          console.log(`Uploading image: ${image}`);
          const result = await cloudinary.v2.uploader.upload(image, {
            upload_preset: 'byp1g876'
          });
          console.log(`Upload successful: ${result.secure_url}`);
          return result.secure_url;
        } catch (error) {
          console.error("Cloudinary upload error:", error);
          throw new Error(error instanceof Error ? error.message : "Failed to upload image");
        }
      })
    );

    const newGallery = await prisma.gallery.create({
      data: {
        title,
        images: imageLinks,
      }
    });

    return NextResponse.json({ 
      message: "success", 
      data: newGallery 
    });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ 
      message: "error", 
      error: error instanceof Error ? error.message : "Internal server error" 
    }, { 
      status: 500 
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const galleries = await prisma.gallery.findMany();
    
    return NextResponse.json({ 
      message: "success", 
      data: galleries 
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ 
      message: "error", 
      error: error instanceof Error ? error.message : "Internal server error" 
    }, { 
      status: 500 
    });
  } finally {
    await prisma.$disconnect();
  }
}
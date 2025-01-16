import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as cloudinary from "cloudinary";

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, images } = body;

    // Validate request body
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { message: "Invalid title" },
        { status: 400 }
      );
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { message: "At least one valid image URL is required" },
        { status: 400 }
      );
    }

    // Upload images to Cloudinary
    const imageLinks = await Promise.all(
      images.map(async (image) => {
        try {
          const result = await cloudinary.v2.uploader.upload(image, {
            upload_preset: "byp1g876",
          });
          return result.secure_url;
        } catch (error) {
          console.error("Cloudinary upload error:", error);
          throw new Error("Failed to upload image to Cloudinary");
        }
      })
    );

    // Save gallery data to Prisma
    const newGallery = await prisma.gallery.create({
      data: {
        title,
        images: imageLinks,
      },
    });

    return NextResponse.json({
      message: "success",
      data: newGallery,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        message: "An error occurred while processing the request",
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    // Fetch all galleries
    const galleries = await prisma.gallery.findMany();
    return NextResponse.json({
      message: "success",
      data: galleries,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching data",
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


export  async function PATCH(req){
  try{
    const body = await req.json();
    const {galleryId, imagesToDelete } = body;

    if(!galleryId || typeof galleryId !== "string"){
      return NextResponse.json({
        message: "Invalid gallery Id"
      }, {status: 400})
    }

    if(!imagesToDelete || !Array.isArray(imagesToDelete) || imagesToDelete.length === 0){
      return NextResponse.json(
        {message: "At least one image URL to delete is required"},
        {status: 400}
      )
    }

    const gallery = await prisma.gallery.findUnique({
      where: {id: galleryId},
    })

    if(!gallery){
      return NextResponse.json(
        {message: "Gallery not found"},
        {status: 404}
      )
    }

    const updatedImages = gallery.images.filter(
      (image) => !imagesToDelete.includes(image)
    )

    await Promise.all(
      imagesToDelete.map(async (imageUrl) => {
        try{
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await cloudinary.v2.uploader.destroy(publicId);
        }catch(error){
          console.log("Cloudinary deletion error: ", error);
        }
      })
    )
    const updatedGallery = await prisma.gallery.update({
      where: { id: galleryId },
      data: { images: updatedImages },
    });

    
    return NextResponse.json({
      message: "Images deleted successfully",
      data: updatedGallery,
    });

  }catch(error){
    console.error("API error:", error);
    return NextResponse.json(
      {
        message: "An error occurred while deleting images",
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }finally{
    await prisma.$disconnect();
  }
}
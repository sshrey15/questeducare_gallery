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

export async function PATCH(req){
    try{
        const body = await req.json();
        const {id, images} = body;
        console.log("body", body);

        if(!id || typeof id !== "string"){

            return NextResponse.json(
                {message: "Invalid gallery ID"},
                {status: 400}
            );
        }

        if(!images || !Array.isArray(images) || images.length === 0){
            return NextResponse.json(
                {message: "At least one valid image URL is required"},
                {status: 400}
            );
        }

        const existingGallery = await prisma.gallery.findUnique({
            where: {id},
        })
        
        if(!existingGallery){
            return NextResponse.json(
                {message: "Gallery not found"},
                {status: 404}
            )
        }



        const imageLinks = await Promise.all(
            images.map(async (image) => {
                try{
                    const result = await cloudinary.v2.uploader.upload(image,{
                        upload_preset: "byp1g876",
                    })
                    return result.secure_url;
                }catch(error){
                    console.error("Cloudinary upload error: ", error);
                    throw new Error("Failed to upload image to Cloudinary")
                }
            })
        )
        const updatedImages = [...existingGallery.images, ...imageLinks];
        const updatedGallery = await prisma.gallery.update({
            where: {id},
            data: {images: updatedImages},
        });

        return NextResponse.json({
            message: "success",
            data: updatedGallery,
        });

    }catch(error){
        console.error("API error: ", error);
        return NextResponse.json(
            {
                message: "An error occurred while processing the request",
                error: error instanceof Error ? error.message : "Internal server error",
            },
            {status: 500}
        )

    }finally{
        await prisma.$disconnect();
    }
}


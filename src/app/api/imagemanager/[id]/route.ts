import {NextResponse, NextRequest} from "next/server";
import {PrismaClient} from "@prisma/client";
import * as cloudinary from "cloudinary";

const prisma = new PrismaClient();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

export async function GET(req: NextRequest, {params}: {params: {id: string}}){
    const id = params.id;
    try{
        const gallery = await prisma.gallery.findUnique({
            where: {id},
        });

        if(!gallery){
            return NextResponse.json(
                {message: "Gallery not found"},
                {status: 404}
            );
        }

        return NextResponse.json({
            message: "success",
            data: gallery,
        });

    }catch(err){
        console.error("API error: ", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json(
            {message: "error", error: errorMessage},
            {status: 500}
        );
    } finally{
        await prisma.$disconnect();
    }
}
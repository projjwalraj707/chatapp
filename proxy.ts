import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { extractPayLoad } from "./app/lib/session";

const protectedRoutes = ["/"];
const publicRoutes = ["/login", "/signup"]

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;
	if (!protectedRoutes.includes(path) && !publicRoutes.includes(path)) return NextResponse.next();
	const payLoad = await extractPayLoad();
	if (protectedRoutes.includes(path) && !payLoad) return NextResponse.redirect(new URL("/login", req.nextUrl));
	if (publicRoutes.includes(path) && payLoad?.userID) return NextResponse.redirect(new URL("/", req.nextUrl));
	return NextResponse.next();
}

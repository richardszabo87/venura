import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  estimateMonthlyRent,
  extractZipFromAddress,
  getZipRentMultiplier,
} from "@/lib/rent-estimate";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const priceParam = searchParams.get("price");
  const zipCodeParam = searchParams.get("zipCode")?.trim() ?? null;
  const addressParam = searchParams.get("address")?.trim() ?? null;
  const bedsParam = searchParams.get("beds");
  const propertyType = searchParams.get("propertyType")?.trim() ?? null;

  const price = priceParam != null ? Number(priceParam) : NaN;
  if (!Number.isFinite(price) || price <= 0) {
    return NextResponse.json(
      { error: "A valid price is required" },
      { status: 400 },
    );
  }

  const zipCode =
    zipCodeParam ??
    (addressParam ? extractZipFromAddress(addressParam) : null) ??
    "20785";

  const beds =
    bedsParam != null && bedsParam !== "" ? Number(bedsParam) : 2;

  const monthlyRent = estimateMonthlyRent({
    price,
    zipCode,
    beds: Number.isFinite(beds) ? beds : 2,
    propertyType,
  });

  return NextResponse.json({
    monthlyRent,
    zipCode,
    price,
    zipMultiplier: getZipRentMultiplier(zipCode),
    formula: "price * 0.011 adjusted by zip, beds, and property type",
  });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const price = Number(body.price);
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const zipCodeInput =
    typeof body.zipCode === "string" ? body.zipCode.trim() : null;
  const beds = body.beds != null ? Number(body.beds) : 2;
  const propertyType =
    typeof body.propertyType === "string" ? body.propertyType : null;

  if (!Number.isFinite(price) || price <= 0) {
    return NextResponse.json(
      { error: "A valid price is required" },
      { status: 400 },
    );
  }

  const zipCode =
    zipCodeInput ??
    (address ? extractZipFromAddress(address) : null) ??
    "20785";

  const monthlyRent = estimateMonthlyRent({
    price,
    zipCode,
    beds: Number.isFinite(beds) ? beds : 2,
    propertyType,
  });

  return NextResponse.json({
    monthlyRent,
    zipCode,
    price,
    address: address || null,
    zipMultiplier: getZipRentMultiplier(zipCode),
    formula: "price * 0.011 adjusted by zip, beds, and property type",
  });
}

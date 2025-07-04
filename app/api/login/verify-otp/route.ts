// ✅ Verifies OTP and returns login token (fake DB for now)
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import twilio from "twilio";

// 🔸 Replace this with your real DB later
const fakeUserDB: Record<string, { phone: string }> = {};

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: Request) {
  const { phone, otp } = await req.json();

  if (!phone || !otp) {
    return NextResponse.json(
      { error: "Missing phone or otp" },
      { status: 400 }
    );
  }

  try {
    const result = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_ID!)
      .verificationChecks.create({ to: phone, code: otp });

    if (result.status === "approved") {
      // ✅ Simulate DB save
      fakeUserDB[phone] = { phone };

      // ✅ Create JWT Token
      const token = jwt.sign({ phone }, process.env.JWT_SECRET!, {
        expiresIn: "365d",
      });

      return NextResponse.json({
        success: true,
        user: fakeUserDB[phone],
        token,
      });
    } else {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }
  } catch (error) {
    console.error("OTP VERIFY ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

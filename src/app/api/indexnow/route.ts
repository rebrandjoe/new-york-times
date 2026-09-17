import { NextResponse } from "next/server";

const HOST = "josephmmwa.com";
const KEY = "jmmwaIndexNow2026";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

export async function POST(request: Request) {
  try {
    const { urls } = await request.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
    }

    const payload = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    };

    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 200 || response.status === 202) {
      return NextResponse.json({ success: true, message: "URLs submitted to IndexNow successfully." });
    } else {
      const errorText = await response.text();
      return NextResponse.json({ success: false, error: errorText }, { status: response.status });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const apiKey = process.env.RAWG_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "RAWG API key is missing" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(
        query
      )}&page_size=10`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "RAWG request failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to RAWG" },
      { status: 500 }
    );
  }
}
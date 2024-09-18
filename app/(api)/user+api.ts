import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  const sql = neon(process.env.DATABASE_URL!);
  console.log("isThis");
  try {
    // const posts = await sql("SELECT * FROM posts");
    const { name, email, clerkId } = await request.json();

    if (!name || !email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const response = await sql`
        INSERT INTO users (
            name,
            email,
            clerk_id
        )
        VALUES (
            ${name},
            ${email},
            ${clerkId}
        )
  `;
    console.log("working");
    // console.log("hello");
    return new Response(JSON.stringify({ data: response }), {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ error: error }, { status: 500 });
  }
}

// See https://neon.tech/docs/serverless/serverless-driver
// for more information

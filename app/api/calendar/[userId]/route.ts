export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  // Fetch calendar events for the user
  const events = await getCalendarEventsForUser(userId);
  return new Response(JSON.stringify(events), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const BARBER_EMAIL = "geraldnashsalas5@gmail.com";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      service,
      appointment_date,
      appointment_time,
      notes,
    } = body;

    if (!name || !email || !phone || !service || !appointment_date || !appointment_time) {
      return new Response(
        JSON.stringify({ error: "Missing required booking fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Save the appointment to the database
    const { error: insertError } = await supabase.from("appointments").insert({
      name,
      email,
      phone,
      service,
      appointment_date,
      appointment_time,
      notes: notes || null,
    });

    if (insertError) {
      console.error("Database insert failed:", insertError.message);
      return new Response(
        JSON.stringify({ error: "Failed to save appointment. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subject = `New Booking — ${name} (${service})`;
    const textBody = [
      `New appointment booked with Nash Salas!`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Service: ${service}`,
      `Date: ${appointment_date}`,
      `Time: ${appointment_time}`,
      notes ? `Notes: ${notes}` : `Notes: (none)`,
    ].join("\n");

    const htmlBody = `
      <div style="font-family: 'Georgia', serif; max-width: 560px; margin: 0 auto; background: #faf7f2; border-radius: 16px; overflow: hidden; border: 1px solid #e8dfd3;">
        <div style="background: linear-gradient(135deg, #1a1a1a, #2d2d2d); padding: 32px; text-align: center;">
          <h1 style="color: #d4a574; margin: 0; font-size: 24px; letter-spacing: 1px;">NASH SALAS</h1>
          <p style="color: #888; margin: 4px 0 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">New Booking Alert</p>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px; color: #333; margin: 0 0 24px;">Someone just booked an appointment!</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; color: #888; font-size: 13px; width: 100px; vertical-align: top;">Name</td><td style="padding: 10px 0; color: #1a1a1a; font-size: 15px; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 10px 0; color: #888; font-size: 13px; vertical-align: top;">Email</td><td style="padding: 10px 0; color: #1a1a1a; font-size: 15px;">${email}</td></tr>
            <tr><td style="padding: 10px 0; color: #888; font-size: 13px; vertical-align: top;">Phone</td><td style="padding: 10px 0; color: #1a1a1a; font-size: 15px;">${phone}</td></tr>
            <tr><td style="padding: 10px 0; color: #888; font-size: 13px; vertical-align: top;">Service</td><td style="padding: 10px 0; color: #1a1a1a; font-size: 15px; font-weight: 600;">${service}</td></tr>
            <tr><td style="padding: 10px 0; color: #888; font-size: 13px; vertical-align: top;">Date</td><td style="padding: 10px 0; color: #1a1a1a; font-size: 15px;">${appointment_date}</td></tr>
            <tr><td style="padding: 10px 0; color: #888; font-size: 13px; vertical-align: top;">Time</td><td style="padding: 10px 0; color: #1a1a1a; font-size: 15px;">${appointment_time}</td></tr>
            <tr><td style="padding: 10px 0; color: #888; font-size: 13px; vertical-align: top;">Notes</td><td style="padding: 10px 0; color: #1a1a1a; font-size: 15px;">${notes || "No notes provided"}</td></tr>
          </table>
        </div>
        <div style="background: #f0e8dd; padding: 16px 32px; text-align: center;">
          <p style="color: #999; font-size: 11px; margin: 0; letter-spacing: 1px;">Sent from Nash Salas Booking System</p>
        </div>
      </div>
    `;

    // Send email via Resend API if RESEND_API_KEY is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (resendApiKey) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Nash Salas Booking <onboarding@resend.dev>",
          to: BARBER_EMAIL,
          subject,
          text: textBody,
          html: htmlBody,
        }),
      });

      if (!emailResponse.ok) {
        const errText = await emailResponse.text();
        console.error("Email send failed:", errText);
      }
    } else {
      console.log("RESEND_API_KEY not configured. Email not sent. Booking saved to database only.");
      console.log("Email content:", textBody);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Booking saved and notification processed" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error processing booking:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

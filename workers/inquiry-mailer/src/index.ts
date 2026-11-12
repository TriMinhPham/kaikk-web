/**
 * kaikk-inquiry-mailer: holds the send_email binding that Pages Functions
 * cannot hold directly. The Pages project binds this Worker as `EMAIL` and
 * calls `env.EMAIL.send({...})` over Workers RPC.
 *
 * Defence in depth: whatever the caller passes, the recipient and sender are
 * fixed here, and the send_email binding is itself restricted to info@kaikk.jp.
 */
import { WorkerEntrypoint } from "cloudflare:workers";

type Env = { SEND: { send(message: Record<string, unknown>): Promise<{ messageId: string }> } };
type Notification = { subject: string; text: string; replyTo?: string };

const TO = "info@kaikk.jp";
const FROM = { email: "inquiry@kaikk.jp", name: "KAI website" };
const oneLine = (v: string) => v.replace(/[\r\n\u2028\u2029]+/g, " ").slice(0, 200);
const SAFE_EMAIL = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[A-Za-z0-9.-]{1,190}$/;

export default class Mailer extends WorkerEntrypoint<Env> {
  async send(message: Notification) {
    const replyTo = message.replyTo && SAFE_EMAIL.test(message.replyTo) ? message.replyTo : undefined;
    const result = await this.env.SEND.send({
      to: TO,
      from: FROM,
      subject: oneLine(String(message.subject ?? "")),
      text: String(message.text ?? "").slice(0, 20000),
      ...(replyTo ? { replyTo } : {}),
    });
    return { messageId: result.messageId };
  }

  async fetch() {
    return new Response("Not found", { status: 404 });
  }
}

# Connecting the LSM design system to Claude

The design system is delivered through an **MCP connector**. How you add it depends on which Claude you use. Adding a connector is always a one-time step done by a person — Claude cannot add it to your account itself (that's a security boundary).

**Connector URL:** `https://design-system-mcp-two.vercel.app/mcp`

---

## Best for a company: an admin adds it once for everyone (Team/Enterprise)

If Little Star Media is on a **Claude Team or Enterprise** plan, an account **admin/owner** can add this as an **organization connector** one time. It then appears for every coworker automatically — nobody else has to set anything up. This is the recommended rollout.

> Admin: in your Claude organization settings → Connectors → add a custom/organization connector with the URL above, and enable it for the org.

## Individual — Claude.ai (web or desktop app)

Requires a **paid plan** (Pro / Max / Team / Enterprise — custom connectors aren't available on Free).

1. **Settings → Connectors**
2. **Add custom connector**
3. Name: `LSM design system` · URL: `https://design-system-mcp-two.vercel.app/mcp`
4. Enable it.

## Individual — Claude Code (the developer CLI)

```bash
claude mcp add --transport http lsm-design https://design-system-mcp-two.vercel.app/mcp
```

---

## After it's connected (any surface)

In a chat, say:

> Use the LSM design system connector — call `get_onboarding` first — then build me **[a marketing report from this data / a dashboard]**.

Claude will pull the rules, the real stylesheet, and the components, and build in the company style.

## Notes / limits
- **Free plan** users can't add custom connectors — they'd need a paid plan, or use an org where an admin has enabled it.
- Claude **can't** add the connector automatically; it's a one-time human (or admin) action.
- If the connector won't attach on Claude.ai, note the exact message — the server transport may need a small adjustment (it's confirmed working with Claude Code today).

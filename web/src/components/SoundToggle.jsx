import { useSfx } from "../hooks/useSfx.js";

export default function SoundToggle() {
  const { enabled, toggle } = useSfx();
  return <button className="sound-toggle" type="button" onClick={toggle} aria-pressed={enabled} aria-label={enabled ? "Désactiver les effets sonores" : "Activer les effets sonores"}>SFX&nbsp;: {enabled ? "ON" : "OFF"}</button>;
}

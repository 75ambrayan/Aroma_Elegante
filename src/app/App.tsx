import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { ShoppingBag, X, Plus, Minus, Menu, MessageCircle, Shield, Star, Truck } from "lucide-react";
import { motion } from "motion/react";
import logo from "../assets/logo-aroma-elegante.png";

/* ─── TYPES ───────────────────────────────────────────────── */
interface Product {
  id: number; name: string; brand: string; price: number; category: string;
  size: string; description: string; notes: string[]; image: string; badge?: string;
  isPack?: boolean; deliveryIncluded?: boolean;
}
interface CartItem extends Product { qty: number; }

/* ─── DATA ────────────────────────────────────────────────── */
const PRODUCTS: Product[] = [
  { id: 1, name: "Dendur", brand: "YANBAL", price: 110, category: "Oriental", size: "50 ml", description: "Fragancia cálida y envolvente con notas de ámbar, vainilla y sándalo peruano.", notes: ["Ámbar", "Vainilla", "Sándalo", "Almizcle"], image: "/productos/ambar-dorado.jpg", badge: "Bestseller" },
  { id: 2, name: "Magnat", brand: "ÉSIKA", price: 110, category: "Floral", size: "50 ml", description: "Frescura floral con esencia de rosa, jazmín y un toque de frutos tropicales.", notes: ["Rosa", "Jazmín", "Frutos Tropicales", "Cedro"], image: "/productos/Magnat.jpg", badge: "Nuevo" },
  { id: 3, name: "Homem", brand: "NATURA", price: 110, category: "Amaderado", size: "50 ml", description: "Inspirado en la Amazonía peruana. Vetiver, pachulí y hojas verdes en perfecta armonía.", notes: ["Vetiver", "Pachulí", "Hojas Verdes", "Cedro"], image: "/productos/Homem.jpg" },
  { id: 4, name: "Temptation", brand: "YANBAL", price: 110, category: "Oriental", size: "50 ml", description: "Oud noble con jazmín nocturno y un fondo de vainilla. Distinción absoluta.", notes: ["Oud", "Jazmín", "Vainilla", "Almizle"], image: "/productos/Temptation.jpg", badge: "Bestseller" },
  { id: 5, name: "Parfum", brand: "ÉSIKA", price: 110, category: "Oriental", size: "50 ml", description: "Mezcla audaz de cardamomo, azafrán y ámbar inspirada en la cultura andina.", notes: ["Cardamomo", "Azafrán", "Ámbar", "Resina"], image: "/productos/DreamEau.jpg" },
  { id: 6, name: "Essencial", brand: "NATURA", price: 110, category: "Amaderado", size: "50 ml", description: "Frescura marina del litoral peruano con notas de bergamota y cedro blanco.", notes: ["Bergamota", "Cedro", "Marina", "Almizcle Blanco"], image: "/productos/PaloSanto.jpg" },
  { id: 7, name: "Love", brand: "ÉSIKA", price: 110, category: "Floral", size: "50 ml", description: "Dulzura floral con miel, rosa y un toque ahumado de tabaco suave.", notes: ["Miel", "Rosa", "Tabaco", "Vainilla"], image: "/productos/City.jpg", badge: "Edición Limitada" },
  { id: 8, name: "QHM", brand: "YANBAL", price: 110, category: "Floral", size: "50 ml", description: "Versión femenina de Dendur. Floral frutal con toques de durazno y jazmín.", notes: ["Durazno", "Jazmín", "Rosa", "Almizcle"], image: "/productos/QHM.jpg" },
];

const PACKS: Product[] = [
  {
    id: 101, name: "Pack Dúo", brand: "AROMA ELEGANTE", price: 210, category: "Pack",
    size: "2 perfumes · 50 ml c/u", description: "Elige 2 perfumes originales con delivery incluido. Ahorra S/. 10 respecto al precio unitario.",
    notes: ["2 Perfumes", "Delivery Incluido", "Garantía Autenticidad", "Ahorro S/. 10"],
    image: "/productos/Pack.jpg", badge: "Delivery Gratis", isPack: true, deliveryIncluded: true,
  },
  {
    id: 102, name: "Pack Trío", brand: "AROMA ELEGANTE", price: 310, category: "Pack",
    size: "3 perfumes · 50 ml c/u", description: "Elige 3 perfumes originales con delivery incluido. El mejor precio por unidad: S/. 103 c/u.",
    notes: ["3 Perfumes", "Delivery Incluido", "Garantía Autenticidad", "Ahorro S/. 20"],
    image: "/productos/PackTrio.jpg", badge: "Mejor Precio", isPack: true, deliveryIncluded: true,
  },
  {
    id: 103, name: "Pack Regalo", brand: "AROMA ELEGANTE", price: 125, category: "Pack",
    size: "1 perfume · 50 ml + empaque premium", description: "1 perfume original con empaque premium, lazo decorativo y tarjeta de agradecimiento. Ideal para fechas especiales.",
    notes: ["1 Perfume", "Empaque Premium", "Lazo Decorativo", "Tarjeta Regalo"],
    image: "/productos/noche-de-lima.jpg", badge: "Ideal para Regalo", isPack: true,
  },
];

const BRANDS = ["Todas", "YANBAL", "ÉSIKA", "NATURA"];
const PREVIEW_COUNT = 4;

/* ─── DESIGN TOKENS ───────────────────────────────────────── */
const BG = "#0C0C0C";
const FG = "#D7E2EA";
const GRADIENT_BTN = "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)";
const GRADIENT_TEXT: React.CSSProperties = {
  background: "linear-gradient(180deg, #646973 0%, #BBCCD7 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};
const FONT = "'Kanit', sans-serif";
const WHATSAPP_URL = "https://wa.me/51955563199?text=Hola,%20me%20interesa%20un%20perfume%20de%20Aroma%20Elegante";

/* ─── REUSABLE ────────────────────────────────────────────── */
function GradientButton({ children, onClick, className = "", href, style: extraStyle }: {
  children: React.ReactNode; onClick?: () => void; className?: string; href?: string; style?: React.CSSProperties;
}) {
  const style: React.CSSProperties = {
    background: GRADIENT_BTN,
    boxShadow: "0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset",
    outline: "2px solid white", outlineOffset: "-3px", fontFamily: FONT, ...extraStyle,
  };
  const cls = `rounded-full font-medium uppercase tracking-widest text-white cursor-pointer transition-opacity hover:opacity-90 ${className}`;
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>{children}</a>;
  return <button onClick={onClick} className={cls} style={style}>{children}</button>;
}

function FadeIn({ children, delay = 0, y = 30, className = "" }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── CART DRAWER ─────────────────────────────────────────── */
function CartDrawer({ cart, cartOpen, setCartOpen, cartCount, cartTotal, updateQty, removeFromCart, onPay }: {
  cart: CartItem[]; cartOpen: boolean; setCartOpen: (v: boolean) => void;
  cartCount: number; cartTotal: number;
  updateQty: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  onPay: () => void;
}) {
  if (!cartOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 backdrop-blur-sm cursor-pointer" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setCartOpen(false)} />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} transition={{ ease: [0.25, 0.1, 0.25, 1], duration: 0.45 }}
        className="w-full max-w-sm flex flex-col shadow-2xl" style={{ background: "#111111", borderLeft: `1px solid ${FG}15` }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${FG}12` }}>
          <div>
            <h2 className="text-base tracking-[0.2em] uppercase font-black" style={{ fontFamily: FONT, ...GRADIENT_TEXT }}>Tu Selección</h2>
            <p className="text-xs mt-0.5" style={{ color: `${FG}50`, fontFamily: FONT }}>{cartCount} {cartCount === 1 ? "artículo" : "artículos"}</p>
          </div>
          <button onClick={() => setCartOpen(false)} className="transition-opacity hover:opacity-70 cursor-pointer bg-transparent border-none" style={{ color: `${FG}60` }}><X size={20} /></button>
        </div>
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6" style={{ color: `${FG}50` }}>
            <ShoppingBag size={40} strokeWidth={1} />
            <p className="text-sm text-center font-light" style={{ fontFamily: FONT }}>Tu selección está vacía.<br />Descubre nuestras fragancias.</p>
            <button onClick={() => setCartOpen(false)} className="rounded-full text-xs tracking-[0.2em] uppercase px-6 py-2.5 transition-opacity hover:opacity-80 cursor-pointer font-medium"
              style={{ border: `1px solid ${FG}30`, color: FG, fontFamily: FONT, background: "transparent" }}>Ver Catálogo</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-20 overflow-hidden flex-shrink-0 rounded-xl" style={{ background: "#0C0C0C" }}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] tracking-wider uppercase mb-0.5" style={{ color: `${FG}50`, fontFamily: FONT }}>{item.brand}</div>
                    <div className="text-sm font-black truncate" style={{ fontFamily: FONT, color: FG }}>{item.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: `${FG}50`, fontFamily: FONT }}>{item.size}</div>
                    {item.deliveryIncluded && (
                      <div className="text-[10px] mt-0.5 font-medium" style={{ color: "#B600A8", fontFamily: FONT }}>🚚 Delivery incluido</div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1" style={{ border: `1px solid ${FG}20` }}>
                        <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center cursor-pointer bg-transparent border-none" style={{ color: `${FG}70` }}><Plus size={12} style={{ transform: "rotate(45deg)" }} /></button>
                        <span className="text-sm w-4 text-center font-medium" style={{ fontFamily: FONT, color: FG }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center cursor-pointer bg-transparent border-none" style={{ color: `${FG}70` }}><Plus size={12} /></button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium" style={{ fontFamily: FONT, color: "#B600A8" }}>S/. {(item.price * item.qty).toLocaleString()}</span>
                        <button onClick={() => removeFromCart(item.id)} className="cursor-pointer bg-transparent border-none" style={{ color: `${FG}40` }}><X size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-5 space-y-3" style={{ borderTop: `1px solid ${FG}12` }}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs tracking-[0.15em] uppercase font-medium" style={{ color: `${FG}60`, fontFamily: FONT }}>Subtotal</span>
                <span className="font-black" style={{ fontFamily: FONT, fontSize: "clamp(1.2rem, 3vw, 1.8rem)", ...GRADIENT_TEXT }}>S/. {cartTotal.toLocaleString()}</span>
              </div>
              <p className="text-xs font-light pb-1" style={{ color: `${FG}40`, fontFamily: FONT }}>Envío a todo el Perú · Pago 100% seguro</p>
              <GradientButton onClick={onPay} className="w-full py-4 text-sm flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                Pagar con tarjeta
              </GradientButton>
              <GradientButton href={WHATSAPP_URL} className="w-full py-3 text-xs flex items-center justify-center gap-2" style={{ opacity: 0.75 }}>
                <MessageCircle size={14} />O pedir por WhatsApp
              </GradientButton>
              <button onClick={() => setCartOpen(false)} className="w-full py-3 text-xs tracking-[0.2em] uppercase font-medium transition-opacity hover:opacity-70 cursor-pointer"
                style={{ border: `1px solid ${FG}20`, color: `${FG}70`, fontFamily: FONT, background: "transparent" }}>Seguir Comprando</button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

/* ─── PAYMENT MODAL ───────────────────────────────────────── */
function PaymentModal({ open, onClose, cartTotal, cart, onSuccess }: {
  open: boolean; onClose: () => void; cartTotal: number; cart: CartItem[]; onSuccess: (email: string) => void;
}) {
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [form, setForm] = useState({ name: "", card: "", expiry: "", cvv: "", email: "", address: "", district: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successEmail, setSuccessEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => { if (!open) { setStep("form"); setForm({ name: "", card: "", expiry: "", cvv: "", email: "", address: "", district: "", phone: "" }); setErrors({}); setEmailTouched(false); setSendingEmail(false); } }, [open]);

  function formatCard(v: string) { return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim(); }
  function formatExpiry(v: string) { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d; }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Ingresa tu nombre";
    if (form.card.replace(/\s/g, "").length < 16) e.card = "Número inválido";
    if (form.expiry.length < 5) e.expiry = "Fecha inválida";
    if (form.cvv.length < 3) e.cvv = "CVV inválido";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email inválido";
    if (!form.address.trim()) e.address = "Ingresa tu dirección";
    if (!form.district.trim()) e.district = "Ingresa tu distrito/ciudad";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 9) e.phone = "Teléfono inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function sendConfirmationEmail(email: string) {
    const SERVICE_ID      = "service_277jest";
    const TEMPLATE_CLIENT = "template_rju4fx8";
    const TEMPLATE_VENDOR = "template_zm2h5g9";
    const PUBLIC_KEY      = "nWCauG6wBkU_e4zcU";

    const itemsList = cart.map(item =>
      `${item.name} ×${item.qty}  →  S/. ${(item.price * item.qty).toLocaleString()}`
    ).join("\n");

    const now = new Date();
    const hora = now.toLocaleString("es-PE", { timeZone: "America/Lima", dateStyle: "short", timeStyle: "short" });

    const params = {
      to_email: email,
      to_name:  form.name,
      items:    itemsList,
      total:    `S/. ${cartTotal.toLocaleString()}`,
      address:  form.address,
      district: form.district,
      phone:    form.phone,
      hora:     hora,
    };

    await emailjs.send(SERVICE_ID, TEMPLATE_CLIENT, params, PUBLIC_KEY);
    await emailjs.send(SERVICE_ID, TEMPLATE_VENDOR, params, PUBLIC_KEY);
  }

  function handlePay() {
    if (!validate()) return;
    setStep("processing");
    setSendingEmail(true);
    sendConfirmationEmail(form.email)
      .catch((err) => console.error("ERROR EMAILJS:", err))
      .finally(() => setSendingEmail(false));
    setTimeout(() => { setSuccessEmail(form.email); setStep("success"); }, 2200);
  }

  if (!open) return null;

  const inputStyle = (field: string): React.CSSProperties => ({
    background: "#0C0C0C", border: `1px solid ${errors[field] ? "#ff4444" : FG + "20"}`,
    color: FG, fontFamily: field === "card" || field === "expiry" || field === "cvv" ? "monospace" : FONT,
    width: "100%", padding: "12px 16px", borderRadius: "8px", outline: "none", fontSize: "14px",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#111111", border: `1px solid ${FG}15`, maxHeight: "90vh", overflowY: "auto" }}>

        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${FG}10` }}>
          <div>
            <h2 className="text-sm tracking-[0.2em] uppercase font-black" style={{ fontFamily: FONT, ...GRADIENT_TEXT }}>Pago Seguro</h2>
            <p className="text-xs mt-0.5" style={{ color: `${FG}40`, fontFamily: FONT }}>Total: S/. {cartTotal.toLocaleString()}</p>
          </div>
          {step !== "processing" && (
            <button onClick={step === "success" ? () => onSuccess(successEmail) : onClose} className="cursor-pointer bg-transparent border-none" style={{ color: `${FG}50` }}><X size={20} /></button>
          )}
        </div>

        <div className="px-6 py-6">
          {step === "form" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {["VISA"].map(c => (
                  <span key={c} style={{ padding: "2px 8px", fontSize: "10px", fontWeight: 900, letterSpacing: "0.1em", borderRadius: "4px", background: `${FG}10`, color: `${FG}50`, fontFamily: FONT }}>{c}</span>
                ))}
                <span style={{ fontSize: "10px", color: `${FG}30`, fontFamily: FONT, marginLeft: "auto" }}></span>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", fontWeight: 500, color: `${FG}50`, fontFamily: FONT }}>Nombre en la tarjeta</label>
                <input type="text" placeholder="JUAN PÉREZ" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value.toUpperCase() }))} style={inputStyle("name")} />
                {errors.name && <p style={{ fontSize: "10px", color: "#ff6666", marginTop: "4px", fontFamily: FONT }}>{errors.name}</p>}
              </div>

              <div>
                <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", fontWeight: 500, color: `${FG}50`, fontFamily: FONT }}>Número de tarjeta</label>
                <input type="text" placeholder="0000 0000 0000 0000" value={form.card}
                  onChange={e => setForm(f => ({ ...f, card: formatCard(e.target.value) }))} style={{ ...inputStyle("card"), letterSpacing: "0.15em" }} />
                {errors.card && <p style={{ fontSize: "10px", color: "#ff6666", marginTop: "4px", fontFamily: FONT }}>{errors.card}</p>}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", fontWeight: 500, color: `${FG}50`, fontFamily: FONT }}>Vencimiento</label>
                  <input type="text" placeholder="MM/AA" value={form.expiry}
                    onChange={e => setForm(f => ({ ...f, expiry: formatExpiry(e.target.value) }))} style={{ ...inputStyle("expiry"), letterSpacing: "0.15em" }} />
                  {errors.expiry && <p style={{ fontSize: "10px", color: "#ff6666", marginTop: "4px", fontFamily: FONT }}>{errors.expiry}</p>}
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", fontWeight: 500, color: `${FG}50`, fontFamily: FONT }}>CVV</label>
                  <input type="password" placeholder="•••" value={form.cvv}
                    onChange={e => setForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))} style={inputStyle("cvv")} />
                  {errors.cvv && <p style={{ fontSize: "10px", color: "#ff6666", marginTop: "4px", fontFamily: FONT }}>{errors.cvv}</p>}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", fontWeight: 500, color: `${FG}50`, fontFamily: FONT }}>Correo electrónico</label>
                <input type="email" placeholder="correo@ejemplo.com" value={form.email}
                  onChange={e => {
                    const val = e.target.value;
                    setForm(f => ({ ...f, email: val }));
                    if (emailTouched) {
                      if (!val) setErrors(ev => ({ ...ev, email: "Ingresa tu correo" }));
                      else if (!/\S+@\S+\.\S+/.test(val)) setErrors(ev => ({ ...ev, email: "Email inválido" }));
                      else setErrors(ev => { const c = { ...ev }; delete c.email; return c; });
                    }
                  }}
                  onBlur={() => {
                    setEmailTouched(true);
                    if (!form.email) setErrors(ev => ({ ...ev, email: "Ingresa tu correo" }));
                    else if (!/\S+@\S+\.\S+/.test(form.email)) setErrors(ev => ({ ...ev, email: "Email inválido" }));
                    else setErrors(ev => { const c = { ...ev }; delete c.email; return c; });
                  }}
                  style={inputStyle("email")} />
                {errors.email && <p style={{ fontSize: "10px", color: "#ff6666", marginTop: "4px", fontFamily: FONT }}>{errors.email}</p>}
                {!errors.email && emailTouched && form.email && /\S+@\S+\.\S+/.test(form.email) && (
                  <p style={{ fontSize: "10px", color: "#4caf50", marginTop: "4px", fontFamily: FONT }}>✓ Correo válido</p>
                )}
              </div>

              <div style={{ borderTop: `1px solid ${FG}15`, paddingTop: "12px" }}>
                <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#B600A8", fontFamily: FONT, marginBottom: "12px", fontWeight: 700 }}>📦 Datos de envío</p>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", fontWeight: 500, color: `${FG}50`, fontFamily: FONT }}>Dirección</label>
                <input type="text" placeholder="Av. Ejemplo 123, Piso 2" value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))} style={inputStyle("address")} />
                {errors.address && <p style={{ fontSize: "10px", color: "#ff6666", marginTop: "4px", fontFamily: FONT }}>{errors.address}</p>}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", fontWeight: 500, color: `${FG}50`, fontFamily: FONT }}>Distrito / Ciudad</label>
                  <input type="text" placeholder="Miraflores" value={form.district}
                    onChange={e => setForm(f => ({ ...f, district: e.target.value }))} style={inputStyle("district")} />
                  {errors.district && <p style={{ fontSize: "10px", color: "#ff6666", marginTop: "4px", fontFamily: FONT }}>{errors.district}</p>}
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", fontWeight: 500, color: `${FG}50`, fontFamily: FONT }}>Teléfono</label>
                  <input type="tel" placeholder="987 654 321" value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 9) }))} style={inputStyle("phone")} />
                  {errors.phone && <p style={{ fontSize: "10px", color: "#ff6666", marginTop: "4px", fontFamily: FONT }}>{errors.phone}</p>}
                </div>
              </div>

              <GradientButton onClick={handlePay} className="w-full py-4 text-sm flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Pagar S/. {cartTotal.toLocaleString()}
              </GradientButton>
            </div>
          )}

          {step === "processing" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0", gap: "24px" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: "56px", height: "56px", borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#B600A8", borderRightColor: "#7621B0" }} />
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "14px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px", fontFamily: FONT, ...GRADIENT_TEXT }}>Procesando pago</p>
                <p style={{ fontSize: "12px", color: `${FG}40`, fontFamily: FONT }}>No cierres esta ventana…</p>
              </div>
            </div>
          )}

          {step === "success" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "24px 0", textAlign: "center" }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}
                style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #B600A8, #7621B0)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </motion.div>
              <div>
                <p style={{ fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "16px", marginBottom: "4px", fontFamily: FONT, ...GRADIENT_TEXT }}>¡Pago exitoso!</p>
                <p style={{ fontSize: "12px", color: `${FG}60`, fontFamily: FONT, marginBottom: "4px" }}>✉️ Confirmación enviada a</p>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#B600A8", fontFamily: FONT }}>{successEmail}</p>
              </div>
              <div style={{ width: "100%", padding: "16px", borderRadius: "12px", background: "#0C0C0C", border: `1px solid ${FG}10` }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontFamily: FONT, marginBottom: "6px" }}>
                    <span style={{ color: `${FG}70` }}>{item.name} ×{item.qty}</span>
                    <span style={{ color: "#B600A8" }}>S/. {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 900, paddingTop: "8px", borderTop: `1px solid ${FG}10`, fontFamily: FONT }}>
                  <span style={{ color: FG }}>Total pagado</span>
                  <span style={{ color: "#B600A8" }}>S/. {cartTotal.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => onSuccess(successEmail)} style={{ width: "100%", padding: "12px", fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500, borderRadius: "9999px", background: GRADIENT_BTN, color: "#fff", border: "none", cursor: "pointer", fontFamily: FONT }}>
                Volver a la tienda
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── PRODUCT CARD ────────────────────────────────────────── */
function ProductCard({ product, onAdd, justAdded }: { product: Product; onAdd: (p: Product) => void; justAdded: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="group flex flex-col cursor-pointer transition-all duration-500"
      style={{ background: "#111111", border: hovered ? `1px solid rgba(182,0,168,0.4)` : `1px solid ${FG}12` }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="relative overflow-hidden aspect-[3/4]" style={{ background: "#0C0C0C" }}>
        <img src={product.image} alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ filter: "brightness(0.8)" }} />
        {product.badge && (
          <div className="absolute top-3 left-3 text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 font-medium text-white"
            style={{ background: GRADIENT_BTN, fontFamily: FONT, borderRadius: "9999px" }}>{product.badge}</div>
        )}
        <div className="absolute inset-0 flex items-end p-4 transition-opacity duration-300"
          style={{ background: "linear-gradient(to top, rgba(12,12,12,0.9) 0%, transparent 60%)", opacity: hovered ? 1 : 0 }}>
          <div className="space-y-0.5">
            {product.notes.map(n => (
              <span key={n} className="inline-block text-[10px] tracking-wider uppercase mr-2 font-light" style={{ color: `${FG}70`, fontFamily: FONT }}>{n}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="text-[10px] tracking-[0.25em] uppercase mb-1 font-medium" style={{ color: `${FG}40`, fontFamily: FONT }}>{product.brand}</div>
        <h3 className="text-base font-black mb-1" style={{ fontFamily: FONT, color: FG }}>{product.name}</h3>
        <p className="text-xs font-light leading-relaxed mb-4 flex-1" style={{ color: `${FG}55`, fontFamily: FONT }}>{product.description}</p>
        {product.deliveryIncluded && (
          <p className="text-[10px] font-medium mb-2" style={{ color: "#B600A8", fontFamily: FONT }}>🚚 Delivery incluido</p>
        )}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-black" style={{ fontFamily: FONT, color: "#B600A8" }}>S/. {product.price}</div>
            <div className="text-[10px] font-light" style={{ color: `${FG}40`, fontFamily: FONT }}>{product.size}</div>
          </div>
          <button onClick={() => onAdd(product)} className="text-xs tracking-[0.15em] uppercase px-4 py-2.5 font-medium transition-all duration-300 cursor-pointer"
            style={justAdded
              ? { background: "rgba(182,0,168,0.15)", border: "1px solid rgba(182,0,168,0.6)", color: "#B600A8", fontFamily: FONT, borderRadius: "9999px" }
              : { border: `1px solid ${FG}25`, color: `${FG}70`, background: "transparent", fontFamily: FONT, borderRadius: "9999px" }}>
            {justAdded ? "Añadido ✓" : "Añadir"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── PACK CARD ───────────────────────────────────────────── */
function PackCard({ pack, onAdd, justAdded }: { pack: Product; onAdd: (p: Product) => void; justAdded: boolean }) {
  const [hovered, setHovered] = useState(false);
  const savings = pack.id === 101 ? 10 : pack.id === 102 ? 20 : null;
  return (
    <div className="flex flex-col transition-all duration-500"
      style={{ background: "#111111", border: hovered ? `1px solid rgba(182,0,168,0.6)` : `1px solid rgba(182,0,168,0.2)`, position: "relative" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {pack.badge && (
        <div className="absolute top-3 right-3 text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 font-medium text-white z-10"
          style={{ background: GRADIENT_BTN, fontFamily: FONT, borderRadius: "9999px" }}>{pack.badge}</div>
      )}
      <div className="relative overflow-hidden" style={{ height: "160px", background: "#0C0C0C" }}>
        <img src={pack.image} alt={pack.name} className="w-full h-full object-cover" style={{ filter: "brightness(0.5)" }} />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="text-[10px] tracking-[0.25em] uppercase mb-1 font-medium" style={{ color: "#B600A8", fontFamily: FONT }}>Pack Especial</div>
        <h3 className="text-lg font-black mb-1" style={{ fontFamily: FONT, color: FG }}>{pack.name}</h3>
        <p className="text-xs font-light leading-relaxed mb-3" style={{ color: `${FG}60`, fontFamily: FONT }}>{pack.description}</p>
        <div className="flex flex-wrap gap-1 mb-4">
          {pack.notes.map(n => (
            <span key={n} className="text-[10px] tracking-wider uppercase px-2 py-0.5 font-medium"
              style={{ border: `1px solid rgba(182,0,168,0.3)`, color: `${FG}70`, fontFamily: FONT, borderRadius: "4px" }}>{n}</span>
          ))}
        </div>
        {savings && (
          <p className="text-xs font-medium mb-3" style={{ color: "#4caf50", fontFamily: FONT }}>✓ Ahorro de S/. {savings} vs precio unitario</p>
        )}
        <button onClick={() => onAdd(pack)} className="w-full py-3 text-xs tracking-[0.15em] uppercase font-medium transition-all duration-300 cursor-pointer mt-auto"
          style={justAdded
            ? { background: "rgba(182,0,168,0.15)", border: "1px solid rgba(182,0,168,0.6)", color: "#B600A8", fontFamily: FONT, borderRadius: "9999px" }
            : { background: GRADIENT_BTN, color: "#fff", border: "none", fontFamily: FONT, borderRadius: "9999px", boxShadow: "0px 4px 4px rgba(181,1,167,0.25)" }}>
          {justAdded ? "Añadido ✓" : `Agregar — S/. ${pack.price}`}
        </button>
      </div>
    </div>
  );
}

/* ─── MAIN APP ────────────────────────────────────────────── */
export default function App() {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [activeBrand, setActiveBrand] = useState("Todas");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [added, setAdded] = useState<number | null>(null);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  useEffect(() => { document.body.style.overflow = (cartOpen || payOpen) ? "hidden" : ""; }, [cartOpen, payOpen]);

  function addToCart(product: Product) {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setAdded(product.id);
    setTimeout(() => setAdded(null), 1500);
  }
  function removeFromCart(id: number) { setCart(prev => prev.filter(i => i.id !== id)); }
  function updateQty(id: number, delta: number) {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  }
  function openPay() { setCartOpen(false); setPayOpen(true); }
  function handlePaySuccess(_email: string) { setPayOpen(false); setCart([]); }

  const filteredProducts = activeBrand === "Todas" ? PRODUCTS : PRODUCTS.filter(p => p.brand === activeBrand);

  /* ── ALL PRODUCTS VIEW ── */
  if (showAllProducts) {
    return (
      <div style={{ background: BG, color: FG, fontFamily: FONT, minHeight: "100vh" }}>
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 md:px-12 h-16 gap-4"
          style={{ background: `${BG}F5`, borderBottom: `1px solid ${FG}12` }}>
          <button onClick={() => setShowAllProducts(false)}
            className="flex items-center gap-2 transition-opacity hover:opacity-70 cursor-pointer bg-transparent border-none text-sm tracking-wider uppercase font-medium"
            style={{ color: `${FG}80`, fontFamily: FONT }}>← Volver</button>
          <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: `${FG}40`, fontFamily: FONT }}>
            / {activeBrand === "Todas" ? "Todos los Perfumes" : activeBrand}
          </span>
          <button className="ml-auto relative transition-opacity hover:opacity-80 cursor-pointer bg-transparent border-none" style={{ color: FG }} onClick={() => setCartOpen(true)}>
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="absolute -top-2 -right-2 text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold" style={{ background: GRADIENT_BTN, color: "#fff" }}>{cartCount}</span>}
          </button>
        </nav>
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-20">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "#B600A8", fontFamily: FONT }}>Colección Completa</p>
            <h2 className="font-black uppercase leading-none mb-10" style={{ fontFamily: FONT, fontSize: "clamp(2.5rem, 8vw, 6rem)", ...GRADIENT_TEXT }}>Todos los Perfumes</h2>
          </FadeIn>
          <div className="flex flex-wrap gap-2 mb-10">
            {BRANDS.map(brand => (
              <button key={brand} onClick={() => setActiveBrand(brand)}
                className="px-5 py-2 text-xs tracking-[0.15em] uppercase font-medium rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  fontFamily: FONT, background: activeBrand === brand ? GRADIENT_BTN : "transparent",
                  color: activeBrand === brand ? "#fff" : `${FG}60`,
                  border: activeBrand === brand ? "none" : `1px solid ${FG}20`,
                  boxShadow: activeBrand === brand ? "0px 4px 4px rgba(181, 1, 167, 0.25)" : "none",
                }}>{brand}</button>
            ))}
            <button
              onClick={() => document.getElementById("packs-section")?.scrollIntoView({ behavior: "smooth" })}
              className="px-5 py-2 text-xs tracking-[0.15em] uppercase font-medium rounded-full transition-all duration-300 cursor-pointer"
              style={{ fontFamily: FONT, background: "transparent", color: "#B600A8", border: "1px solid rgba(182,0,168,0.4)" }}>
              Packs
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => (
              <FadeIn key={product.id} delay={i * 0.05}>
                <ProductCard product={product} onAdd={addToCart} justAdded={added === product.id} />
              </FadeIn>
            ))}
          </div>

          {/* PACKS dentro de todos los perfumes */}
          <div id="packs-section" className="mt-20 pt-16" style={{ borderTop: `1px solid ${FG}15` }}>
            <FadeIn>
              <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "#B600A8", fontFamily: FONT }}>Combos y Packs</p>
              <h2 className="font-black uppercase leading-none mb-4" style={{ fontFamily: FONT, fontSize: "clamp(2.5rem, 8vw, 6rem)", ...GRADIENT_TEXT }}>Packs</h2>
              <p className="text-sm font-light mb-12 max-w-lg" style={{ color: `${FG}60`, fontFamily: FONT }}>Ahorra más comprando en pack. Los packs Dúo y Trío incluyen delivery gratis a todo el Perú.</p>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PACKS.map((pack, i) => (
                <FadeIn key={pack.id} delay={i * 0.1}>
                  <PackCard pack={pack} onAdd={addToCart} justAdded={added === pack.id} />
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={0.3}>
              <div className="mt-10 p-5 text-center" style={{ border: `1px solid ${FG}10`, background: "#111111" }}>
                <p className="text-xs font-light" style={{ color: `${FG}50`, fontFamily: FONT }}>
                  💬 ¿Quieres armar tu pack personalizado? Escríbenos por{" "}
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#B600A8", textDecoration: "none" }}>WhatsApp</a>
                  {" "}y te asesoramos.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
        <CartDrawer cart={cart} cartOpen={cartOpen} setCartOpen={setCartOpen} cartCount={cartCount} cartTotal={cartTotal} updateQty={updateQty} removeFromCart={removeFromCart} onPay={openPay} />
        <PaymentModal open={payOpen} onClose={() => setPayOpen(false)} cartTotal={cartTotal} cart={cart} onSuccess={handlePaySuccess} />
      </div>
    );
  }

  /* ── MAIN PAGE ── */
  return (
    <div style={{ background: BG, color: FG, fontFamily: FONT, overflowX: "clip" }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16"
  style={{ background: `linear-gradient(to bottom, ${BG}F5, transparent)` }}>
  
  {/* Izquierda: hamburguesa en mobile, links en desktop */}
  <div className="flex items-center">
    <button className="md:hidden cursor-pointer bg-transparent border-none" style={{ color: FG }} onClick={() => setMenuOpen(!menuOpen)}>
      <Menu size={20} />
    </button>
    <div className="hidden md:flex items-center gap-8 text-xs tracking-[0.2em] uppercase">
      {[{ label: "Inicio", href: "#" }, { label: "Catálogo", href: "#catalogo" }, { label: "Nosotros", href: "#nosotros" }, { label: "Contacto", href: "#contacto" }].map(l => (
        <a key={l.label} href={l.href} className="transition-colors duration-200" style={{ color: `${FG}80` }}
          onMouseEnter={e => (e.currentTarget.style.color = FG)} onMouseLeave={e => (e.currentTarget.style.color = `${FG}80`)}>{l.label}</a>
      ))}
    </div>
  </div>

  {/* Centro: logo */}
  <div className="absolute left-1/2 -translate-x-1/2">
    <span className="text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.4em] uppercase font-black whitespace-nowrap" style={{ fontFamily: FONT, ...GRADIENT_TEXT }}>AROMA ELEGANTE</span>
  </div>

  {/* Derecha: carrito */}
  <button className="relative cursor-pointer bg-transparent border-none" style={{ color: FG }} onClick={() => setCartOpen(true)}>
    <ShoppingBag size={20} />
    {cartCount > 0 && <span className="absolute -top-2 -right-2 text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold" style={{ background: GRADIENT_BTN, color: "#fff" }}>{cartCount}</span>}
  </button>
</nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8" style={{ background: `${BG}F5` }}>
          <button className="absolute top-5 right-6 cursor-pointer bg-transparent border-none" style={{ color: `${FG}80` }} onClick={() => setMenuOpen(false)}><X size={22} /></button>
          {[{ label: "Inicio", href: "#" }, { label: "Catálogo", href: "#catalogo" }, { label: "Nosotros", href: "#nosotros" }, { label: "Contacto", href: "#contacto" }].map(l => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="text-2xl tracking-[0.2em] uppercase font-black transition-opacity hover:opacity-70" style={{ fontFamily: FONT, ...GRADIENT_TEXT }}>{l.label}</a>
          ))}
        </div>
      )}

      {/* HERO */}
      <section className="relative h-screen flex flex-col overflow-x-clip">
        <img src="/hero-perfumes.jpg"
          alt="Perfumes de lujo" className="absolute inset-0 w-full h-full object-cover object-center" style={{ filter: "brightness(0.35)", transform: "scale(1.05)" }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${BG} 0%, transparent 60%)` }} />
        <div className="flex-1 flex items-end justify-center pb-0 relative z-10 mt-20 overflow-hidden">
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-black uppercase tracking-tight leading-none text-center w-full"
            style={{ fontFamily: FONT, fontSize: "clamp(2.2rem, 10vw, 10rem)", ...GRADIENT_TEXT }}>AROMA ELEGANTE</motion.h1>
        </div>
        <div className="relative z-10 flex justify-between items-end px-6 md:px-12 pb-10 mt-4">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7 }}
            className="font-light uppercase tracking-wide leading-snug max-w-[200px] sm:max-w-[260px]"
            style={{ fontSize: "clamp(0.7rem, 1.3vw, 1.1rem)", color: `${FG}99`, fontFamily: FONT }}>
            Perfumes originales de marcas nacionales · Garantía de autenticidad
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}>
            <GradientButton className="px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base"
              onClick={() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })}>Explorar Catálogo</GradientButton>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16" style={{ borderTop: `1px solid ${FG}15`, borderBottom: `1px solid ${FG}15` }}>
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[{ label: "Perfumes Originales", value: "100%" }, { label: "Marcas Nacionales", value: "3+" }, { label: "Clientes Satisfechos", value: "50+" }].map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.1}>
              <div className="font-black" style={{ fontFamily: FONT, fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1, ...GRADIENT_TEXT }}>{s.value}</div>
              <div className="text-xs tracking-[0.2em] uppercase mt-1" style={{ color: `${FG}60`, fontFamily: FONT }}>{s.label}</div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalogo" className="py-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "#B600A8", fontFamily: FONT }}>Nuestras Fragancias</p>
            <h2 className="font-black uppercase leading-none" style={{ fontFamily: FONT, fontSize: "clamp(3rem, 10vw, 8rem)", ...GRADIENT_TEXT }}>Catálogo</h2>
          </FadeIn>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.slice(0, PREVIEW_COUNT).map((product, i) => (
            <FadeIn key={product.id} delay={i * 0.05}>
              <ProductCard product={product} onAdd={addToCart} justAdded={added === product.id} />
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.2}>
          <div className="flex justify-center mt-12">
            <button onClick={() => { setShowAllProducts(true); window.scrollTo(0, 0); }}
              className="group flex items-center gap-3 px-10 py-4 text-sm tracking-[0.2em] uppercase font-medium transition-all duration-300 cursor-pointer"
              style={{ border: `1px solid ${FG}25`, color: FG, background: "transparent", fontFamily: FONT, borderRadius: "9999px" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(182,0,168,0.6)"; (e.currentTarget as HTMLButtonElement).style.color = "#B600A8"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${FG}25`; (e.currentTarget as HTMLButtonElement).style.color = FG; }}>
              Ver todos los perfumes <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </FadeIn>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="py-20" style={{ borderTop: `1px solid ${FG}15` }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] uppercase mb-3 text-center" style={{ color: "#B600A8", fontFamily: FONT }}>Quiénes Somos</p>
            <h2 className="font-black uppercase leading-none text-center mb-16" style={{ fontFamily: FONT, fontSize: "clamp(2.5rem, 8vw, 6rem)", ...GRADIENT_TEXT }}>Nosotros</h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <FadeIn delay={0.1}>
              <div className="p-8 h-full" style={{ background: "#111111", border: `1px solid ${FG}12` }}>
                <div className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#B600A8", fontFamily: FONT }}>Misión</div>
                <p className="font-light leading-relaxed" style={{ color: `${FG}80`, fontFamily: FONT }}>Somos una empresa peruana dedicada a la comercialización de perfumes originales de marcas nacionales, dirigida a hombres y mujeres, mediante una tienda virtual y atención personalizada, ofreciendo productos de calidad y una experiencia de compra confiable y accesible.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="p-8 h-full" style={{ background: "#111111", border: `1px solid ${FG}12` }}>
                <div className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#B600A8", fontFamily: FONT }}>Visión</div>
                <p className="font-light leading-relaxed" style={{ color: `${FG}80`, fontFamily: FONT }}>Ser una tienda virtual líder en la comercialización de perfumes de marcas nacionales en el Perú al 2031, reconocida por su calidad, innovación digital y excelencia en el servicio al cliente.</p>
              </div>
            </FadeIn>
          </div>
          <FadeIn>
            <p className="text-xs tracking-[0.3em] uppercase mb-8 text-center" style={{ color: "#B600A8", fontFamily: FONT }}>Nuestros Valores</p>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: <Star size={22} />, title: "Calidad", desc: "Perfumes originales de marcas nacionales" },
              { icon: <Shield size={22} />, title: "Confianza", desc: "Garantizamos autenticidad en cada producto" },
              { icon: <MessageCircle size={22} />, title: "Compromiso", desc: "Atención rápida y eficiente" },
              { icon: <Star size={22} />, title: "Transparencia", desc: "Información clara en precios y productos" },
              { icon: <Truck size={22} />, title: "Responsabilidad", desc: "Cumplimos con normas comerciales" },
            ].map((v, i) => (
              <FadeIn key={v.title + i} delay={i * 0.08}>
                <div className="p-5 flex flex-col items-center text-center gap-3" style={{ background: "#111111", border: `1px solid ${FG}12` }}>
                  <div style={{ color: "#B600A8" }}>{v.icon}</div>
                  <div className="text-sm font-black uppercase tracking-wider" style={{ fontFamily: FONT, color: FG }}>{v.title}</div>
                  <div className="text-xs font-light leading-relaxed" style={{ color: `${FG}55`, fontFamily: FONT }}>{v.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED BANNER */}
      <section className="relative overflow-hidden my-4">
        <div className="absolute inset-0" style={{ background: "#111111", borderTop: `1px solid ${FG}12`, borderBottom: `1px solid ${FG}12` }} />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 grid md:grid-cols-2 gap-12 items-center">
          <FadeIn y={40}>
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "#B600A8", fontFamily: FONT }}>Más Vendido</p>
            <h2 className="font-black uppercase leading-tight mb-6" style={{ fontFamily: FONT, fontSize: "clamp(2rem, 5vw, 4rem)", ...GRADIENT_TEXT }}>Parfum City</h2>
            <p className="font-light leading-relaxed mb-8 max-w-md" style={{ color: `${FG}70`, fontFamily: FONT }}>Nuestra fragancia estrella. Oud noble con jazmín nocturno y un fondo de vainilla peruana. Distinción absoluta en cada gota. 100% original, garantizado.</p>
            <GradientButton className="px-10 py-4 text-sm" onClick={() => addToCart(PRODUCTS[3])}>Añadir al Carrito — S/. 110</GradientButton>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="relative h-72 md:h-80 overflow-hidden rounded-3xl" style={{ background: "#0C0C0C" }}>
              <img src="/productos/City.jpg" alt="Parfum City" className="w-full h-full object-cover" style={{ opacity: 0.80 }} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-20" style={{ borderTop: `1px solid ${FG}15` }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "#B600A8", fontFamily: FONT }}>Atención Personalizada</p>
            <h2 className="font-black uppercase leading-none mb-6" style={{ fontFamily: FONT, fontSize: "clamp(2rem, 7vw, 5rem)", ...GRADIENT_TEXT }}>Contáctanos</h2>
            <p className="font-light leading-relaxed mb-10" style={{ color: `${FG}70`, fontFamily: FONT }}>¿Tienes dudas sobre algún perfume? ¿Quieres asesoría personalizada? Escríbenos por WhatsApp y respondemos en menos de 24 horas.</p>
            <GradientButton href={WHATSAPP_URL} className="px-12 py-4 text-sm inline-flex items-center gap-3"><MessageCircle size={18} />Escribir por WhatsApp</GradientButton>
            <p className="mt-6 text-xs font-light" style={{ color: `${FG}40`, fontFamily: FONT }}>También nos encuentras en Instagram y TikTok como @aromaelegante</p>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 md:px-12 max-w-7xl mx-auto" style={{ borderTop: `1px solid ${FG}15` }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <img src={logo} alt="Aroma Elegante" style={{ height: "56px", objectFit: "contain", marginBottom: "12px" }} />
            <p className="font-light leading-relaxed text-sm" style={{ color: `${FG}60`, fontFamily: FONT }}>Perfumes originales de marcas nacionales. Perú 🇵🇪</p>
          </div>
          {[
            { title: "Explorar", links: ["Catálogo", "Packs", "Bestsellers", "Ediciones Limitadas"] },
            { title: "Ayuda", links: ["Envíos", "Garantía de Autenticidad", "Devoluciones", "Contacto"] },
            { title: "Marcas", links: ["Yanbal", "Ésika", "Natura"] },
          ].map(col => (
            <div key={col.title}>
              <div className="text-xs tracking-[0.2em] uppercase mb-4 font-medium" style={{ color: "#B600A8", fontFamily: FONT }}>{col.title}</div>
              <ul className="space-y-2">
                {col.links.map(l => <li key={l}><span className="text-sm font-light" style={{ color: `${FG}55`, fontFamily: FONT }}>{l}</span></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs" style={{ borderTop: `1px solid ${FG}12`, color: `${FG}40`, fontFamily: FONT }}>
          <span>© 2026 Aroma Elegante. Todos los derechos reservados.</span>
          <span>Envío a todo el Perú · Pagos con Yape, Plin y tarjetas</span>
        </div>
      </footer>

      {/* CART + PAYMENT */}
      <CartDrawer cart={cart} cartOpen={cartOpen} setCartOpen={setCartOpen} cartCount={cartCount} cartTotal={cartTotal} updateQty={updateQty} removeFromCart={removeFromCart} onPay={openPay} />
      <PaymentModal open={payOpen} onClose={() => setPayOpen(false)} cartTotal={cartTotal} cart={cart} onSuccess={handlePaySuccess} />
    </div>
  );
}
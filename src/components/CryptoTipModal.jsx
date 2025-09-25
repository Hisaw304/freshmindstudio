// CryptoTipModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

// Wallet config (kept local and simple)
const WALLETS = {
  BTC: {
    label: "Bitcoin",
    icon: "₿",
    address: "35toacsAQ9mz29Z8sf9tcXN1sXas5YWuXe",
  },
  ETH: {
    label: "Ethereum",
    icon: "Ξ",
    address: "0x7cc3677377a69b85d96e05b98a04639be73c3843",
  },
  USDT: {
    label: "Tether",
    icon: "🪙",
    address: "TBNm6a2p98X4cagNSPN8brXmYz8NvVuVJU",
  },
};

export default function CryptoTipModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null); // 'BTC' | 'ETH' | 'USDT' or null
  const [copiedAddress, setCopiedAddress] = useState("");
  const lastActiveElRef = useRef(null);
  const modalRef = useRef(null);

  // Open modal: save last active element for focus restoration
  const openModal = () => {
    lastActiveElRef.current = document.activeElement;
    setIsOpen(true);
  };

  // Close modal and restore focus
  const closeModal = () => {
    setIsOpen(false);
    setSelectedKey(null);
    if (lastActiveElRef.current?.focus) {
      try {
        lastActiveElRef.current.focus();
      } catch (e) {}
    }
  };

  // Copy with clipboard API and fallback
  const copyToClipboard = async (address) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(address);
      } else {
        // fallback
        const ta = document.createElement("textarea");
        ta.value = address;
        // avoid page jump
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(""), 2000);
    } catch (err) {
      console.error("copy failed", err);
      alert("Could not copy address — please select and copy manually.");
    }
  };

  // Keyboard handling & focus trap
  useEffect(() => {
    if (!isOpen) return;

    // lock scroll
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
        return;
      }

      if (e.key === "Tab") {
        // simple focus trap
        const modal = modalRef.current;
        if (!modal) return;
        const focusable = modal.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // focus the close button (first interactive)
    const timer = setTimeout(() => {
      const modal = modalRef.current;
      if (!modal) return;
      const btn = modal.querySelector(".crypto-close, button");
      if (btn?.focus) btn.focus();
    }, 0);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // select wallet (toggle)
  const handleSelectWallet = (key) => {
    setSelectedKey((prev) => (prev === key ? null : key));
  };

  // Prevent overlay click from closing when clicking inside modal
  const onModalClick = (e) => {
    e.stopPropagation();
  };

  const selectedWallet = selectedKey ? WALLETS[selectedKey] : null;

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={openModal}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-extrabold shadow-lg transition-transform hover:scale-105"
        style={{
          background:
            "linear-gradient(90deg, var(--brand-yellow), color-mix(in srgb, var(--brand-yellow) 80%, white 20%))",
          color: "var(--text-strong)",
        }}
      >
        <span aria-hidden>💖</span>
        <span>Support Fresh Mind</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          role="presentation"
          onClick={closeModal}
        >
          {/* overlay */}
          <div className="crypto-overlay" aria-hidden />

          {/* modal */}
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="crypto-modal-heading"
            aria-describedby="crypto-modal-desc"
            className="crypto-modal-card cm-modal-enter-active"
            onClick={onModalClick}
          >
            {/* close */}
            <button
              type="button"
              className="crypto-close"
              onClick={closeModal}
              aria-label="Close support modal"
            >
              ✖
            </button>

            {/* header */}
            <h2 id="crypto-modal-heading" className="text-xl font-extrabold">
              ✨ Support Fresh Mind
            </h2>
            <p
              id="crypto-modal-desc"
              className="mt-1 text-sm"
              style={{ color: "var(--muted-color)" }}
            >
              Your tip helps keep our tools free &amp; growing.
            </p>

            {/* wallets */}
            <div className="mt-4 space-y-3">
              {Object.entries(WALLETS).map(([key, wallet]) => {
                const active = selectedKey === key;
                return (
                  <div
                    key={key}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectWallet(key)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelectWallet(key);
                      }
                    }}
                    className={`crypto-wallet ${active ? "ring" : ""}`}
                    aria-pressed={active}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <span style={{ fontSize: 20 }}>{wallet.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700 }}>{wallet.label}</div>
                        <div
                          style={{ fontSize: 12, color: "var(--muted-color)" }}
                        >
                          {wallet.address.slice(0, 18)}
                          {wallet.address.length > 18 ? "…" : ""}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(wallet.address);
                        }}
                        className="crypto-btn"
                        aria-label={`Copy ${wallet.label} address`}
                      >
                        Copy Address
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* QR + full address */}
            {selectedWallet && (
              <div className="mt-4 text-center">
                <h3 className="font-semibold mb-2">
                  {selectedWallet.label} QR
                </h3>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <QRCodeCanvas value={selectedWallet.address} size={160} />
                </div>
                <p
                  className="mt-2 text-sm"
                  style={{
                    color: "var(--muted-color)",
                    wordBreak: "break-all",
                  }}
                >
                  {selectedWallet.address}
                </p>
                <div className="mt-3 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedWallet.address)}
                    className="crypto-btn"
                  >
                    Copy Address
                  </button>
                </div>
              </div>
            )}

            {/* copied toast */}
            {copiedAddress && (
              <div className="crypto-toast" role="status" aria-live="polite">
                Copied!
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

import React from "react";
import FooterCta from "../components/FooterCta";
import Contact from "../components/Contact";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ContactPage = () => {
  return (
    <div>
      <section className="fm-st-about-hero">
        {/* GRID BG */}
        <div className="fm-st-about-hero-grid" />

        <div className="fm-st-about-hero-container">
          <div className="fm-st-about-hero-content">
            <div className="fm-st-about-hero-badge">
              <span>Contact Us</span>
            </div>

            <h1>
              Let’s build <span>something great</span>
            </h1>

            <p>
              Have a question, partnership idea, feature request, or just want
              to say hello? We’d love to hear from you. Reach out and our team
              will get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>
      <Contact />

      <section className="fm-st-contact-map">
        <div className="fm-st-contact-map-container">
          {/* HEADER */}
          <div className="fm-st-contact-map-header">
            <span className="fm-st-contact-map-badge">Our Location</span>

            <h2>
              Working remotely with clients
              <span className="fm-st-highlight"> worldwide</span>
            </h2>

            <p>
              Focus Studio operates remotely and collaborates with businesses,
              creators, and startups across different industries and locations.
            </p>
          </div>

          {/* MAP */}
          <div className="fm-st-contact-map-card">
            <MapContainer
              center={[44.0582, -121.3153]}
              zoom={10}
              scrollWheelZoom={false}
              className="fm-st-leaflet-map"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={[44.0582, -121.3153]}>
                <Popup>
                  Focus Studio <br />
                  Bend, Oregon
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </section>
      <FooterCta />
    </div>
  );
};

export default ContactPage;

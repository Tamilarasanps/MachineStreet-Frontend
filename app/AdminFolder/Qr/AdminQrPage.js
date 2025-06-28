import React from "react";
import { Platform } from "react-native";
import QrPosterWeb from "./AdminQrPageWeb";
import QrPosterMobile from "./AdminQrPageMobile";

const AdminQrPage = () => {
  return Platform.OS === "web" ? <QrPosterWeb /> : <QrPosterMobile />;
};

export default AdminQrPage;

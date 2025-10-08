"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Wallet,
  ChevronDown,
  ChevronRight,
  Info,
  Search,
} from "lucide-react";

const banks = [
  { bank_code: "mandiri", name: "Mandiri", fee: 1998 },
  { bank_code: "bri", name: "BRI", fee: 1998 },
  { bank_code: "bca", name: "BCA", fee: 1998 },
  { bank_code: "bni", name: "BNI", fee: 1998 },
  { bank_code: "bsm", name: "BSI (Bank Syariah Indonesia)", fee: 1998 },
  { bank_code: "cimb", name: "CIMB Niaga", fee: 1998 },
  { bank_code: "danamon", name: "Danamon", fee: 1998 },
  { bank_code: "permata", name: "Permata", fee: 1998 },
  { bank_code: "maybank", name: "Maybank", fee: 1998 },
  { bank_code: "mega", name: "Mega", fee: 1998 },
  { bank_code: "ocbc", name: "OCBC NISP", fee: 1998 },
  { bank_code: "panin", name: "Panin", fee: 1998 },
  { bank_code: "bukopin", name: "Bukopin", fee: 1998 },
  { bank_code: "btpn", name: "BTPN", fee: 1998 },
  { bank_code: "hsbc", name: "HSBC", fee: 1998 },
  { bank_code: "standard_chartered", name: "Standard Chartered", fee: 1998 },
  { bank_code: "uob", name: "UOB", fee: 1998 },
  { bank_code: "citibank", name: "Citibank", fee: 1998 },
  { bank_code: "dbs", name: "DBS", fee: 1998 },
  { bank_code: "mayapada", name: "Mayapada", fee: 1998 },
  { bank_code: "bjb", name: "Bank BJB", fee: 1998 },
  { bank_code: "jatim", name: "Bank Jatim", fee: 1998 },
  { bank_code: "jateng", name: "Bank Jateng", fee: 1998 },
  { bank_code: "sumut", name: "Bank Sumut", fee: 1998 },
  { bank_code: "kalbar", name: "Bank Kalbar", fee: 1998 },
  { bank_code: "kalsel", name: "Bank Kalsel", fee: 1998 },
  { bank_code: "kaltim", name: "Bank Kaltim", fee: 1998 },
  { bank_code: "sulselbar", name: "Bank Sulselbar", fee: 1998 },
  { bank_code: "sulut", name: "Bank SulutGo", fee: 1998 },
  { bank_code: "ntt", name: "Bank NTT", fee: 1998 },
  { bank_code: "maluku", name: "Bank Maluku", fee: 1998 },
  { bank_code: "papua", name: "Bank Papua", fee: 1998 },
  { bank_code: "bengkulu", name: "Bank Bengkulu", fee: 1998 },
  { bank_code: "sulteng", name: "Bank Sulteng", fee: 1998 },
];

export default function TarikUangPage() {
  const router = useRouter();
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [showBankList, setShowBankList] = useState(false);
  const [searchBank, setSearchBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const MIN_ACCOUNT_LENGTH = 8;
  const MAX_ACCOUNT_LENGTH = 20;
  const MIN_WITHDRAWAL = 10000; // Minimum withdrawal 10,000

  const handleSubmit = async () => {
    if (!selectedBank || !accountNumber || !amount) {
      setError("Mohon lengkapi semua data");
      return;
    }

    if (
      accountNumber.length < MIN_ACCOUNT_LENGTH ||
      accountNumber.length > MAX_ACCOUNT_LENGTH
    ) {
      setError(
        `Nomor rekening harus ${MIN_ACCOUNT_LENGTH}-${MAX_ACCOUNT_LENGTH} digit`
      );
      return;
    }

    const amountNumber = Number(amount);

    if (amountNumber < MIN_WITHDRAWAL) {
      setError(
        `Jumlah penarikan minimal Rp ${MIN_WITHDRAWAL.toLocaleString("id-ID")}`
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("Token tidak ditemukan. Silakan login kembali.");
        router.push("/login");
        return;
      }

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      const response = await fetch(`${API_URL}/payouts/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amountNumber,
          bank_code: selectedBank.bank_code,
          account_number: accountNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal memproses penarikan");
      }

      const result = await response.json();
      console.log("Response dari backend:", result);

      // Show success message
      alert("Permintaan tarik uang berhasil disubmit!");

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memproses penarikan"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number ? Number(number).toLocaleString("id-ID") : "";
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setAmount(value);
  };

  const filteredBanks = banks.filter(
    (bank) =>
      bank.name.toLowerCase().includes(searchBank.toLowerCase()) ||
      bank.bank_code.toLowerCase().includes(searchBank.toLowerCase())
  );

  const adminFee = selectedBank?.fee || 0;
  const amountNumber = Number(amount) || 0;
  const totalReceived = amountNumber > adminFee ? amountNumber - adminFee : 0;

  const isFormValid =
    selectedBank &&
    accountNumber.length >= MIN_ACCOUNT_LENGTH &&
    accountNumber.length <= MAX_ACCOUNT_LENGTH &&
    amountNumber >= MIN_WITHDRAWAL;

  const getErrorMessage = () => {
    if (!selectedBank) return "Pilih bank terlebih dahulu";
    if (accountNumber.length < MIN_ACCOUNT_LENGTH)
      return "Nomor rekening minimal 8 digit";
    if (accountNumber.length > MAX_ACCOUNT_LENGTH)
      return "Nomor rekening maksimal 20 digit";
    if (amountNumber > 0 && amountNumber < MIN_WITHDRAWAL)
      return `Jumlah penarikan minimal Rp ${MIN_WITHDRAWAL.toLocaleString(
        "id-ID"
      )}`;
    return "";
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 relative">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 bg-white border border-gray-200 p-2 rounded-full shadow-sm hover:shadow-md transition-all"
      >
        <ArrowLeft className="w-5 h-5 text-[#4b63d0]" />
      </button>

      <div className="max-w-2xl w-full bg-white rounded-2xl mt-12 md:mt-0 shadow-lg p-8 border border-gray-100 animate-fadeSlideIn">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Wallet className="w-12 h-12 text-[#6582e6]" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Tarik Uang Komitmen
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Tarik dana komitmen belajar Anda ke rekening bank pilihan
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Bank Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Bank Tujuan
            </label>
            <div className="relative">
              <button
                onClick={() => setShowBankList(!showBankList)}
                className="w-full p-4 border border-gray-300 rounded-xl bg-white flex items-center justify-between hover:border-[#6582e6] transition-colors focus:outline-none focus:border-[#6582e6]"
              >
                <span
                  className={
                    selectedBank ? "text-gray-900 font-medium" : "text-gray-500"
                  }
                >
                  {selectedBank ? selectedBank.name : "Pilih Bank"}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    showBankList ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Bank List Dropdown dengan Search */}
              {showBankList && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-10">
                  {/* Search Input */}
                  <div className="p-3 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Cari bank..."
                        value={searchBank}
                        onChange={(e) => setSearchBank(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6582e6] text-sm"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Bank List */}
                  <div className="max-h-60 overflow-y-auto">
                    {filteredBanks.length > 0 ? (
                      filteredBanks.map((bank) => (
                        <button
                          key={bank.bank_code}
                          onClick={() => {
                            setSelectedBank(bank);
                            setShowBankList(false);
                            setSearchBank("");
                          }}
                          className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="font-medium text-gray-900">
                            {bank.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Biaya admin: Rp {bank.fee.toLocaleString("id-ID")}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        Bank tidak ditemukan
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Rekening
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= MAX_ACCOUNT_LENGTH) {
                  setAccountNumber(value);
                }
              }}
              placeholder="Masukkan nomor rekening"
              className={`w-full p-4 border rounded-xl focus:outline-none transition-colors ${
                accountNumber &&
                (accountNumber.length < MIN_ACCOUNT_LENGTH ||
                  accountNumber.length > MAX_ACCOUNT_LENGTH)
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-[#6582e6]"
              }`}
              maxLength={MAX_ACCOUNT_LENGTH}
            />
            <div className="flex justify-between mt-1">
              <span
                className={`text-xs ${
                  accountNumber &&
                  (accountNumber.length < MIN_ACCOUNT_LENGTH ||
                    accountNumber.length > MAX_ACCOUNT_LENGTH)
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {MIN_ACCOUNT_LENGTH}-{MAX_ACCOUNT_LENGTH} digit
              </span>
              <span className="text-xs text-gray-400">
                {accountNumber.length}/{MAX_ACCOUNT_LENGTH}
              </span>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Penarikan
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                Rp
              </span>
              <input
                type="text"
                value={formatCurrency(amount)}
                onChange={handleAmountChange}
                placeholder="0"
                className={`w-full p-4 pl-12 border rounded-xl focus:outline-none transition-colors ${
                  amount && Number(amount) < MIN_WITHDRAWAL
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-[#6582e6]"
                }`}
              />
            </div>
            <div className="mt-1">
              <span
                className={`text-xs ${
                  amount && Number(amount) < MIN_WITHDRAWAL
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                Minimal penarikan Rp {MIN_WITHDRAWAL.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Summary */}
          {amount && selectedBank && Number(amount) >= MIN_WITHDRAWAL && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Rincian Penarikan
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Jumlah penarikan:</span>
                  <span className="font-medium">
                    Rp {amountNumber.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Biaya admin:</span>
                  <span className="font-medium text-red-500">
                    - Rp {adminFee.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="border-t border-indigo-200 pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Yang Anda terima:</span>
                    <span className="text-[#6582e6]">
                      Rp {totalReceived.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Info className="text-gray-600 w-5 h-5" />
              <h3 className="font-semibold text-gray-800">Informasi Penting</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Penarikan akan diproses dalam 1-2 hari kerja</li>
              <li>• Pastikan nomor rekening sudah benar sebelum submit</li>
              <li>
                • Nomor rekening harus {MIN_ACCOUNT_LENGTH}-{MAX_ACCOUNT_LENGTH}{" "}
                digit
              </li>
              <li>
                • Minimal penarikan Rp {MIN_WITHDRAWAL.toLocaleString("id-ID")}
              </li>
              <li>• Biaya admin bervariasi sesuai bank yang dipilih</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className="w-full bg-[#6582e6] text-white py-4 rounded-xl font-medium hover:bg-[#5571d5] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Memproses Penarikan...
              </>
            ) : (
              <>
                Tarik Uang
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Warning message untuk button disabled */}
          {!isFormValid && (selectedBank || accountNumber || amount) && (
            <div className="text-center">
              <p className="text-sm text-red-500">{getErrorMessage()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for dropdown */}
      {showBankList && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowBankList(false)}
        />
      )}

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeSlideIn {
          animation: fadeSlideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

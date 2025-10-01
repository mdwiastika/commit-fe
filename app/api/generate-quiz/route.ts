import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { material, progress, file } = await request.json()

    // Mock quiz generation based on material
    const quizQuestions = {
      "Design Principles": [
        {
          id: 1,
          question: "Apa fungsi utama dari prinsip kontras dalam desain?",
          options: [
            "Menekankan perbedaan elemen agar mudah dibedakan",
            "Memberikan keseimbangan warna agar terlihat seragam",
            "Mengurangi jumlah warna yang digunakan dalam desain",
            "Membuat desain terlihat sederhana",
          ],
          correctAnswer: 0,
        },
        {
          id: 2,
          question: "Prinsip hierarki visual dalam desain berfungsi untuk?",
          options: [
            "Membuat semua elemen terlihat sama penting",
            "Mengarahkan mata pembaca sesuai prioritas informasi",
            "Menggunakan font yang sama di seluruh desain",
            "Menghindari penggunaan warna",
          ],
          correctAnswer: 1,
        },
      ],
      Wireframing: [
        {
          id: 1,
          question: "Manakah yang merupakan prinsip dasar dalam wireframing?",
          options: [
            "Menggunakan warna yang menarik",
            "Fokus pada struktur dan layout",
            "Menambahkan animasi yang kompleks",
            "Menggunakan font yang beragam",
          ],
          correctAnswer: 1,
        },
        {
          id: 2,
          question: "Tujuan utama dari low-fidelity wireframe adalah?",
          options: [
            "Menampilkan desain final",
            "Menentukan struktur dasar dan alur informasi",
            "Menguji performa aplikasi",
            "Membuat prototype yang interaktif",
          ],
          correctAnswer: 1,
        },
      ],
      Typography: [
        {
          id: 1,
          question: "Apa yang dimaksud dengan kerning dalam tipografi?",
          options: [
            "Jarak antar baris teks",
            "Ukuran font yang digunakan",
            "Jarak antar karakter dalam kata",
            "Warna teks yang dipilih",
          ],
          correctAnswer: 2,
        },
        {
          id: 2,
          question: "Font serif cocok digunakan untuk?",
          options: [
            "Tampilan digital modern",
            "Teks panjang dalam media cetak",
            "Logo perusahaan teknologi",
            "Interface aplikasi mobile",
          ],
          correctAnswer: 1,
        },
      ],
    }

    const questions = quizQuestions[material as keyof typeof quizQuestions] || quizQuestions["Design Principles"]

    const quizData = {
      questions,
      timeLimit: 900, // 15 minutes
    }

    return NextResponse.json(quizData)
  } catch (error) {
    console.error("Error generating quiz:", error)
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 })
  }
}

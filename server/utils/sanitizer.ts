export interface SanitizeResult {
  isSafe: boolean;
  reason?: string;
}

export const sanitizeLatex = (code: string): SanitizeResult => {
  if (!code || typeof code !== "string") {
    return { isSafe: false, reason: "Kode LaTeX tidak boleh kosong." };
  }

  // Daftar pola sintaks berbahaya (blacklist)
  const dangerousPatterns = [
    { pattern: /\\write18/i, name: "Shell Escape Execution (\\write18)" },
    { pattern: /\\immediate\\write/i, name: "Immediate File Output" },
    { pattern: /\\openout/i, name: "File Writing Stream (\\openout)" },
    { pattern: /\\openin/i, name: "File Reading Stream (\\openin)" },
    {
      pattern: /\\input\s*\{?\s*(\/|\.\.)/i,
      name: "Path Traversal File Access (\\input)",
    },
    {
      pattern: /\\include\s*\{?\s*(\/|\.\.)/i,
      name: "Path Traversal File Access (\\include)",
    },
    { pattern: /\\read/i, name: "File Input Stream (\\read)" },
    { pattern: /\\sys_shell_now:n/i, name: "LaTeX3 Shell Execution" },
  ];

  for (const { pattern, name } of dangerousPatterns) {
    if (pattern.test(code)) {
      return {
        isSafe: false,
        reason: `Penggunaan perintah berbahaya terdeteksi: ${name}. Perintah ini dinonaktifkan demi keamanan sistem.`,
      };
    }
  }

  return { isSafe: true };
};

import { normalizeString, debounce } from "../utils";
// import { describe, test, expect, vi } from "vitest";
import { debounce } from "../utils";

describe("normalizeString", () => {
  test("retourne une chaîne normalisée en minuscules et sans espaces", () => {
    expect(normalizeString("  Bonjour  ")).toBe("bonjour");
  });

  test("retourne une chaîne vide si l'entrée est une chaîne vide", () => {
    expect(normalizeString("")).toBe("");
  });

  test("retourne une chaîne vide si l'entrée est null ou undefined", () => {
    expect(normalizeString(null)).toBe("");
    expect(normalizeString(undefined)).toBe("");
  });

  test("garde les caractères spéciaux", () => {
    expect(normalizeString("  Ça va bien! ")).toBe("ça va bien!");
  });
});


describe("debounce", () => {
    test("appelle la fonction après le délai spécifié", (done) => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
  
      // Appeler la fonction plusieurs fois
      debouncedFn();
      debouncedFn();
      debouncedFn();
  
      // La fonction ne doit pas être appelée immédiatement
      expect(mockFn).not.toHaveBeenCalled();
  
      // Vérifier que la fonction est appelée après le délai
      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1); // Doit être appelé une seule fois après le délai
        done();
      }, 150); // Attendre plus que le délai de 100 ms
    });
  
    test("réinitialise le délai si la fonction est rappelée", (done) => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
  
      // Appel initial
      debouncedFn();
  
      // Appeler de nouveau avant le délai
      setTimeout(() => {
        debouncedFn();
  
        // La fonction ne doit pas être appelée encore
        expect(mockFn).not.toHaveBeenCalled();
      }, 50);
  
      // Vérifier que la fonction est appelée après le nouveau délai
      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1);
        done();
      }, 200); // Total : 50 ms + 100 ms d'attente
    });
  });
  
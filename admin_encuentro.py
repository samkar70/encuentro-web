import customtkinter as ctk
import sqlite3
import os
import sys
from datetime import datetime
from tkinter import messagebox, filedialog

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

# --- LÓGICA DE RUTA (Recuperada de tus archivos) ---
def obtener_ruta_base():
    if getattr(sys, 'frozen', False): return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))

DB_FILENAME = 'biblia_completa_rvr1960.db'
db_path_init = os.path.join(obtener_ruta_base(), DB_FILENAME)

class AppEncuentro(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.db_actual = db_path_init
        self.title("Panel de Control Encuentro v2.0")
        self.geometry("1200x800")
        
        if not os.path.exists(self.db_actual):
            self.seleccionar_db_manual()

        self.setup_ui()

    def seleccionar_db_manual(self):
        archivo = filedialog.askopenfilename(title="Seleccionar Base de Datos", filetypes=[("DB Files", "*.db")])
        if archivo: self.db_actual = archivo
        else: self.destroy()

    def conectar(self):
        return sqlite3.connect(self.db_actual)

    def setup_ui(self):
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        # --- SIDEBAR ---
        self.sidebar = ctk.CTkFrame(self, width=220, corner_radius=0)
        self.sidebar.grid(row=0, column=0, sticky="nsew")
        ctk.CTkLabel(self.sidebar, text="ENCUENTRO", font=("Arial", 22, "bold")).pack(pady=40)

        # Botones de navegación
        ctk.CTkButton(self.sidebar, text="📹 Videos", command=lambda: self.cambiar_vista("videos")).pack(pady=10, padx=20)
        ctk.CTkButton(self.sidebar, text="🖼️ Fotos (Identidad)", command=lambda: self.cambiar_vista("fotos")).pack(pady=10, padx=20)
        ctk.CTkButton(self.sidebar, text="📖 Tablero de Salmos", command=lambda: self.cambiar_vista("salmos_master")).pack(pady=10, padx=20)
        
        ctk.CTkLabel(self.sidebar, text=f"DB: {os.path.basename(self.db_actual)}", font=("Arial", 10), text_color="gray").pack(side="bottom", pady=20)

        # --- ÁREA PRINCIPAL ---
        self.main_frame = ctk.CTkFrame(self, corner_radius=20, fg_color="transparent")
        self.main_frame.grid(row=0, column=1, sticky="nsew", padx=30, pady=30)
        self.cambiar_vista("salmos_master")

    def cambiar_vista(self, tabla):
        for widget in self.main_frame.winfo_children(): widget.destroy()
        
        titulos = {"videos": "Gestión de Videos", "fotos": "Identidad Visual", "salmos_master": "Tablero de Control Espiritual (Salmos)"}
        ctk.CTkLabel(self.main_frame, text=titulos[tabla], font=("Arial", 24, "bold"), text_color="#FFB100").pack(pady=10)

        if tabla == "salmos_master":
            ctk.CTkLabel(self.main_frame, text="Aquí puedes editar la Clave Cristológica y los Audios de cada Salmo", font=("Arial", 12), text_color="gray").pack()

        self.scroll = ctk.CTkScrollableFrame(self.main_frame, height=550)
        self.scroll.pack(fill="both", expand=True, padx=5, pady=20)
        self.cargar_lista(tabla)

    def cargar_lista(self, tabla):
        for widget in self.scroll.winfo_children(): widget.destroy()
        try:
            conn = self.conectar()
            cursor = conn.cursor()
            
            if tabla == "salmos_master":
                cursor.execute('SELECT id, numero_salmo, titulo_occidental FROM salmos_master ORDER BY numero_salmo ASC')
            elif tabla == "videos":
                cursor.execute('SELECT id, titulo FROM videos ORDER BY id DESC')
            else:
                cursor.execute('SELECT id, seccion FROM fotos ORDER BY id DESC')
            
            for r in cursor.fetchall():
                f = ctk.CTkFrame(self.scroll, fg_color="#1A1C1E")
                f.pack(fill="x", pady=4, padx=10)
                
                txt = f"Salmo {r[1]}: {r[2]}" if tabla == "salmos_master" else f"ID: {r[0]} | {r[1]}"
                ctk.CTkLabel(f, text=txt, width=500, anchor="w").pack(side="left", padx=15, pady=10)
                
                ctk.CTkButton(f, text="Editar", fg_color="#2E86C1", width=80, command=lambda row_id=r[0]: self.abrir_formulario(tabla, row_id)).pack(side="right", padx=10)
            conn.close()
        except Exception as e: messagebox.showerror("Error", str(e))

    def abrir_formulario(self, tabla, row_id):
        form = ctk.CTkToplevel(self)
        form.title(f"Editando {tabla}")
        form.geometry("700x850")
        form.attributes("-topmost", True)
        form.grab_set()

        # Obtener datos actuales
        conn = self.conectar()
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM {tabla} WHERE id=?", (row_id,))
        data = cursor.fetchone()
        columnas = [description[0] for description in cursor.description]
        conn.close()

        ctk.CTkLabel(form, text=f"EDITAR REGISTRO #{row_id}", font=("Arial", 20, "bold"), text_color="#FFB100").pack(pady=20)
        
        entries = {}
        scroll_form = ctk.CTkScrollableFrame(form, height=600)
        scroll_form.pack(fill="both", expand=True, padx=20)

        # Generar campos dinámicamente según la tabla
        for i, col in enumerate(columnas):
            if col == 'id': continue
            ctk.CTkLabel(scroll_form, text=f"{col.replace('_', ' ').upper()}:", font=("Arial", 12, "bold")).pack(pady=(15, 0), anchor="w")
            
            # Usar Textbox para campos largos
            if col in ['analisis_psychologico', 'clave_cristologica', 'texto_clave', 'descripcion']:
                entry = ctk.CTkTextbox(scroll_form, height=100, width=600, border_width=1)
                entry.insert("1.0", str(data[i]) if data[i] else "")
            else:
                entry = ctk.CTkEntry(scroll_form, width=600)
                entry.insert(0, str(data[i]) if data[i] else "")
            
            entry.pack(pady=5)
            entries[col] = entry

        def guardar():
            # Recolectar datos
            updates = []
            params = []
            for col, widget in entries.items():
                val = widget.get("1.0", "end-1c") if isinstance(widget, ctk.CTkTextbox) else widget.get()
                updates.append(f"{col}=?")
                params.append(val)
            
            params.append(row_id)
            try:
                conn = self.conectar()
                conn.execute(f"UPDATE {tabla} SET {', '.join(updates)} WHERE id=?", params)
                conn.commit()
                conn.close()
                messagebox.showinfo("Éxito", "Datos actualizados correctamente")
                form.destroy()
                self.cargar_lista(tabla)
            except Exception as e: messagebox.showerror("Error", str(e))

        ctk.CTkButton(form, text="💾 GUARDAR CAMBIOS", fg_color="#27AE60", height=50, command=guardar).pack(pady=20)

if __name__ == "__main__":
    AppEncuentro().mainloop()

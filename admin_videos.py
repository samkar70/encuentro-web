import customtkinter as ctk
import sqlite3
import os
import sys
from datetime import datetime
from tkinter import messagebox, filedialog

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

# --- GESTIÓN DE RUTA ---
def obtener_ruta_base():
    if getattr(sys, 'frozen', False): return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))

DB_FILENAME = 'biblia_completa_rvr1960.db'
db_path_init = os.path.join(obtener_ruta_base(), DB_FILENAME)

class AppVideos(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.db_actual = db_path_init
        self.title("Administrador Encuentro - Edición de Videos")
        self.geometry("1000x700")
        
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

        # Sidebar
        self.sidebar = ctk.CTkFrame(self, width=220, corner_radius=0)
        self.sidebar.grid(row=0, column=0, sticky="nsew")
        ctk.CTkLabel(self.sidebar, text="ENCUENTRO", font=("Arial", 22, "bold", "italic")).pack(pady=40)

        ctk.CTkButton(self.sidebar, text="📋 Lista de Videos", command=self.mostrar_lista).pack(pady=10, padx=20)
        ctk.CTkButton(self.sidebar, text="➕ Nuevo Video", fg_color="#27AE60", command=lambda: self.abrir_formulario()).pack(pady=10, padx=20)
        
        ctk.CTkLabel(self.sidebar, text=f"Base de datos activa:\n{os.path.basename(self.db_actual)}", font=("Arial", 10), text_color="gray").pack(side="bottom", pady=20)

        # Main
        self.main_frame = ctk.CTkFrame(self, corner_radius=20, fg_color="transparent")
        self.main_frame.grid(row=0, column=1, sticky="nsew", padx=30, pady=30)
        self.mostrar_lista()

    def mostrar_lista(self):
        for widget in self.main_frame.winfo_children(): widget.destroy()
        ctk.CTkLabel(self.main_frame, text="Gestión de Contenido", font=("Arial", 24, "bold")).pack(pady=10)
        
        self.scroll = ctk.CTkScrollableFrame(self.main_frame, height=500)
        self.scroll.pack(fill="both", expand=True, padx=5, pady=5)

        try:
            conn = self.conectar()
            cursor = conn.cursor()
            cursor.execute('SELECT id, titulo, url_video, descripcion, categoria FROM videos ORDER BY id DESC')
            rows = cursor.fetchall()
            for r in rows:
                f = ctk.CTkFrame(self.scroll, fg_color="#1A1C1E")
                f.pack(fill="x", pady=5, padx=10)
                
                ctk.CTkLabel(f, text=f"ID: {r[0]} | {r[1]}", width=350, anchor="w", font=("Arial", 13, "bold")).pack(side="left", padx=15, pady=10)
                
                # Botones de Acción
                ctk.CTkButton(f, text="Borrar", fg_color="#C0392B", width=70, command=lambda i=r[0]: self.borrar(i)).pack(side="right", padx=5)
                ctk.CTkButton(f, text="Editar", fg_color="#2E86C1", width=70, command=lambda row=r: self.abrir_formulario(row)).pack(side="right", padx=5)
            conn.close()
        except Exception as e:
            messagebox.showerror("Error", str(e))

    def abrir_formulario(self, datos_edit=None):
        form = ctk.CTkToplevel(self)
        form.title("Editor de Video" if datos_edit else "Nuevo Video")
        form.geometry("550x650")
        form.attributes("-topmost", True)
        form.grab_set() # Bloquea la ventana principal hasta cerrar esta

        ctk.CTkLabel(form, text="DATOS DEL VIDEO", font=("Arial", 20, "bold"), text_color="#FFB100").pack(pady=20)

        # Campos
        campos = {}
        config = [("titulo", "Título:"), ("url_video", "URL YouTube:"), ("descripcion", "Descripción:"), ("categoria", "Categoría:")]
        
        for i, (col, label) in enumerate(config):
            ctk.CTkLabel(form, text=label).pack(pady=(10,0))
            if col == "descripcion":
                entry = ctk.CTkTextbox(form, height=120, width=450, border_width=1)
                if datos_edit: entry.insert("1.0", datos_edit[3])
            elif col == "categoria" and not datos_edit:
                entry = ctk.CTkComboBox(form, values=["Enseñanza", "Serie Salmos", "Entrevista"], width=450)
            else:
                entry = ctk.CTkEntry(form, width=450)
                if datos_edit:
                    val = datos_edit[1] if col == "titulo" else (datos_edit[2] if col == "url_video" else datos_edit[4])
                    entry.insert(0, val)
            entry.pack(pady=5)
            campos[col] = entry

        def guardar():
            vals = {k: (v.get("1.0", "end").strip() if isinstance(v, ctk.CTkTextbox) else v.get()) for k, v in campos.items()}
            if not vals["titulo"] or not vals["url_video"]: return messagebox.showwarning("Aviso", "Título y URL obligatorios")
            
            try:
                conn = self.conectar()
                if datos_edit: # UPDATE
                    conn.execute('UPDATE videos SET titulo=?, url_video=?, descripcion=?, categoria=? WHERE id=?', 
                                 (vals["titulo"], vals["url_video"], vals["descripcion"], vals["categoria"], datos_edit[0]))
                else: # INSERT
                    fecha = datetime.now().strftime('%Y-%m-%d')
                    conn.execute('INSERT INTO videos (titulo, url_video, descripcion, categoria, fecha_publicacion) VALUES (?,?,?,?,?)',
                                 (vals["titulo"], vals["url_video"], vals["descripcion"], vals["categoria"], fecha))
                conn.commit()
                conn.close()
                form.destroy()
                self.mostrar_lista()
            except Exception as e: messagebox.showerror("Error", str(e))

        ctk.CTkButton(form, text="💾 GUARDAR CAMBIOS", command=guardar, height=50, fg_color="#27AE60").pack(pady=40)

    def borrar(self, id_v):
        if messagebox.askyesno("Confirmar", f"¿Eliminar video ID {id_v}?"):
            conn = self.conectar()
            conn.execute("DELETE FROM videos WHERE id=?", (id_v,))
            conn.commit()
            conn.close()
            self.mostrar_lista()

if __name__ == "__main__":
    AppVideos().mainloop()

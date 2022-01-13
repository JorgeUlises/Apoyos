using System;
using System.Collections.Generic;

#nullable disable

namespace Acciones.Models
{
    public partial class Legislatura
    {
        public Legislatura()
        {
            Eventos = new HashSet<Evento>();
            Peticiones = new HashSet<Peticione>();
            Visita = new HashSet<Visita>();
        }

        public int LegislaturaId { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int Estatus { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }

        public virtual ICollection<Evento> Eventos { get; set; }
        public virtual ICollection<Peticione> Peticiones { get; set; }
        public virtual ICollection<Visita> Visita { get; set; }
    }
}

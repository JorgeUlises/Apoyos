using System;
using System.Collections.Generic;

#nullable disable

namespace Acciones.Models
{
    public partial class Diputado
    {
        public Diputado()
        {
            Eventos = new HashSet<Evento>();
            Peticiones = new HashSet<Peticione>();
            Usuarios = new HashSet<Usuario>();
            Visita = new HashSet<Visita>();
        }

        public int DiputadoId { get; set; }
        public string Nombre { get; set; }
        public string Paterno { get; set; }
        public string Materno { get; set; }
        public int? LegislaturaId { get; set; }
        public string Notas { get; set; }
        public int? Estatus { get; set; }
        public int? PartidoId { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }

        public virtual ICollection<Evento> Eventos { get; set; }
        public virtual ICollection<Peticione> Peticiones { get; set; }
        public virtual ICollection<Usuario> Usuarios { get; set; }
        public virtual ICollection<Visita> Visita { get; set; }
    }
}

using System;
using System.Collections.Generic;

#nullable disable

namespace Acciones.Models
{
    public partial class Visita
    {
        public Visita()
        {
            ArchivosVisita = new HashSet<ArchivosVisita>();
            LugaresVisitados = new HashSet<LugaresVisitado>();
            PersonasVisitada = new HashSet<PersonasVisitada>();
        }

        public int VisitaId { get; set; }
        public int? LegislaturaId { get; set; }
        public int? DiputadoId { get; set; }
        public DateTime? Fecha { get; set; }
        public string Descripcion { get; set; }
        public string Distrito { get; set; }
        public string Seccion { get; set; }
        public int? Estatus { get; set; }
        public string Campo1 { get; set; }
        public int? Campo2 { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }

        public virtual Diputado Diputado { get; set; }
        public virtual Legislatura Legislatura { get; set; }
        public virtual ICollection<ArchivosVisita> ArchivosVisita { get; set; }
        public virtual ICollection<LugaresVisitado> LugaresVisitados { get; set; }
        public virtual ICollection<PersonasVisitada> PersonasVisitada { get; set; }
    }
}

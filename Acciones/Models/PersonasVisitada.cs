using System;
using System.Collections.Generic;

#nullable disable

namespace Acciones.Models
{
    public partial class PersonasVisitada
    {
        public int PersonaVisitadaId { get; set; }
        public int? VisitaId { get; set; }
        public int? CiudadanoId { get; set; }
        public string Notas { get; set; }
        public int? Estatus { get; set; }
        public string Latitud { get; set; }
        public string Longitud { get; set; }
        public string Campo1 { get; set; }
        public int? Campo2 { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }

        public virtual Ciudadano Ciudadano { get; set; }
        public virtual Visita Visita { get; set; }
    }
}

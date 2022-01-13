using System;
using System.Collections.Generic;

#nullable disable

namespace Acciones.Models
{
    public partial class AsistentesEvento
    {
        public int AsistentesEventoId { get; set; }
        public int CiudadanoId { get; set; }
        public int EventoId { get; set; }
        public string Comentarios { get; set; }
        public int Estatus { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }

        public virtual Ciudadano Ciudadano { get; set; }
        public virtual Evento Evento { get; set; }
    }
}

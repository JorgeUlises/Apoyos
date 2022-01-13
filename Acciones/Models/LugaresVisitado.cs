using System;
using System.Collections.Generic;

#nullable disable

namespace Acciones.Models
{
    public partial class LugaresVisitado
    {
        public int LugarVisitadoId { get; set; }
        public int? VisitaId { get; set; }
        public int? ColoniaId { get; set; }
        public int? CalleId { get; set; }
        public string NumExterior { get; set; }
        public string NumInterior { get; set; }
        public int? Cp { get; set; }
        public string Distrito { get; set; }
        public string Seccion { get; set; }
        public string Notas { get; set; }
        public int? Estatus { get; set; }
        public string Latitud { get; set; }
        public string Longitud { get; set; }
        public string Campo1 { get; set; }
        public int? Campo2 { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }

        public virtual Calle Calle { get; set; }
        public virtual Colonia Colonia { get; set; }
        public virtual Visita Visita { get; set; }
    }
}

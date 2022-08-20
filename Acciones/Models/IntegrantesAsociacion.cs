using System;
using System.Collections.Generic;

#nullable disable

namespace Acciones.Models
{
    public partial class IntegrantesAsociacion
    {
        public int IntegrantesAsociacionId { get; set; }
        public int? CiudadanoId { get; set; }
        public int? AsociacionId { get; set; }
        public string Puesto { get; set; }
        public string Notas { get; set; }
        public int? Estatus { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistroId { get; set; }
        public int? Representante { get; set; }

        public virtual Asociacione Asociacion { get; set; }
        public virtual Ciudadano Ciudadano { get; set; }
    }
}

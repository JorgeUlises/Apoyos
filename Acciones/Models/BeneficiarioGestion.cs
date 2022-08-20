using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.Models
{
    public class BeneficiarioGestion
    {
        public int BeneficiariosGestionId { get; set; }
        public int? CiudadanoId { get; set; }
        public int? GestionId { get; set; }
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
        public virtual Gestiones Gestion { get; set; }
    }
}

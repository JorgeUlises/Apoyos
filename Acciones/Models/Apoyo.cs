using System;
using System.Collections.Generic;

#nullable disable

namespace Acciones.Models
{
    public partial class Apoyo
    {
        public int ApoyoId { get; set; }
        public int? PeticionId { get; set; }
        public int? BeneficiarioId { get; set; }
        public int? CatalogoApoyosId { get; set; }
        public string Descripcion { get; set; }
        public int? Estatus { get; set; }
        public double? Costo { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }

        public virtual Beneficiario Beneficiario { get; set; }
    }
}

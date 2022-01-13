using System;
using System.Collections.Generic;

#nullable disable

namespace Acciones.Models
{
    public partial class PeticionSubcategorium
    {
        public int PeticionSubcategoriaId { get; set; }
        public int? PeticionCategoriaId { get; set; }
        public int? PeticionId { get; set; }
        public int? SubcategoriaId { get; set; }
        public string Descripcion { get; set; }
        public int? Estatus { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }

        public virtual Peticione Peticion { get; set; }
        public virtual Subcategoria Subcategoria { get; set; }
    }
}

using System;
using System.Collections.Generic;

#nullable disable

namespace Acciones.Models
{
    public partial class PeticionCategorium
    {
        public int PeticionCategoriaId { get; set; }
        public int? PeticionId { get; set; }
        public int? CategoriaId { get; set; }
        public string Descripcion { get; set; }
        public int? Estatus { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }

        public virtual Categoria Categoria { get; set; }
        public virtual Peticione Peticion { get; set; }
    }
}

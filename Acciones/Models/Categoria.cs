using System;
using System.Collections.Generic;

#nullable disable

namespace Acciones.Models
{
    public partial class Categoria
    {
        public Categoria()
        {
            PeticionCategoria = new HashSet<PeticionCategorium>();
            Subcategoria = new HashSet<Subcategoria>();
        }

        public int CategoriaId { get; set; }
        public string Descripcion { get; set; }
        public int? Estatus { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistroId { get; set; }

        public virtual ICollection<PeticionCategorium> PeticionCategoria { get; set; }
        public virtual ICollection<Subcategoria> Subcategoria { get; set; }
    }
}

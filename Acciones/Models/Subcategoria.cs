using System;
using System.Collections.Generic;

#nullable disable

namespace Acciones.Models
{
    public partial class Subcategoria
    {
        public Subcategoria()
        {
            PeticionSubcategoria = new HashSet<PeticionSubcategorium>();
            GestionSubcategoria = new HashSet<GestionSubcategoria>();
        }

        public int SubcategoriasId { get; set; }
        public int CategoriaId { get; set; }
        public string Descripcion { get; set; }
        public int? Estatus { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistroId { get; set; }

        public virtual Categoria Categoria { get; set; }
        public virtual ICollection<PeticionSubcategorium> PeticionSubcategoria { get; set; }
        public virtual ICollection<GestionSubcategoria> GestionSubcategoria { get; set; }
    }
}

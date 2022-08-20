using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.Models
{
    public class GestionSubcategoria
    {
        public int GestionSubcategoriaId { get; set; }
        public int? GestionCategoriaId { get; set; }
        public int? GestionId { get; set; }
        public int? SubcategoriaId { get; set; }
        public string Descripcion { get; set; }
        public int? Estatus { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }

        public virtual Gestiones Gestion { get; set; }
        public virtual Subcategoria Subcategoria { get; set; }
    }
}

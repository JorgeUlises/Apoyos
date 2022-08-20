using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.Models
{
    public partial class GestionCategoria
    {
        public int GestionCategoriaId { get; set; }
        public int? GestionId { get; set; }
        public int? CategoriaId { get; set; }
        public string Descripcion { get; set; }
        public int? Estatus { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }

        public virtual Categoria Categoria { get; set; }
        public virtual Gestiones Gestion { get; set; }
    }
}

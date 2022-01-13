using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.ViewModel
{
    public class DetalleCategoriaSubcategoria
    {
        public int PeticionId { get; set; }
        public int CategoriaId { get; set; }
        public string Categoria { get; set; }
        public int SubcategoriaId { get; set; }
        public string Subcategoria { get; set; }
    }
}

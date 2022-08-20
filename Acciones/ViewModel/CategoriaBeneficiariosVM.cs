using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.ViewModel
{
    public class CategoriaBeneficiariosVM
    {
        public int CategoriaId { get; set; }
        public string Categoria { get; set; }
        public int NumeroBenef { get; set; }
        public IEnumerable<ObjetoBeneficiarioPeticion> BeneficiariosPeticiones { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.ViewModel
{
    public class ObjetoBeneficiarioPeticion
    {
        public int PeticionId { get; set; }
        public int CiudadnoId { get; set; }
        public string Nombre { get; set; }
        public string Peticion { get; set; }
        public string Folio { get; set; }
    }
}

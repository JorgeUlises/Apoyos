﻿using System;
using System.Collections.Generic;

#nullable disable

namespace Acciones.Models
{
    public partial class EstatusPeticione
    {
        public EstatusPeticione()
        {
            Peticiones = new HashSet<Peticione>();
        }

        public int EstatusPeticionesId { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int Estatus { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }

        public virtual ICollection<Peticione> Peticiones { get; set; }
    }
}

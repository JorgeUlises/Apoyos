using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Acciones.Models;
using Acciones.ViewModel;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.Data.SqlClient;

namespace Acciones.Controllers
{
    public class PublicidadController : Controller
    {
        private readonly dbAccionesContext _context;

        public PublicidadController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Publicidad
        public async Task<IActionResult> Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            List<SelectListItem> LstTipoPublicidad = new SelectList(_context.TipoPublicidad, "TipoPublicidadId", "Nombre").ToList();
            LstTipoPublicidad.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["TipoPublicidad"] = LstTipoPublicidad;

            List<SelectListItem> LstOrigenPublicidad = new SelectList(_context.OrigenPublicidad, "OrigenPublicidadId", "Nombre").ToList();
            LstOrigenPublicidad.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["OrigenPublicidad"] = LstOrigenPublicidad;

            //ViewBag.JavaScriptFunction = string.Format("ListaPublicidadCiudadano();");
            ViewBag.JavaScriptFunction = string.Format("FiltraPublicidad();");
            
            ViewBag.Coordenadas = UbicacionPublicidad();
            ViewBag.Coordenadas_2 = UbicacionPublicidad_2();
            return View(await _context.Publicidad.ToListAsync());
        }

        // GET: Publicidad/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var publicidad = await _context.Publicidad
                .FirstOrDefaultAsync(m => m.PublicidadId == id);
            if (publicidad == null)
            {
                return NotFound();
            }

            return View(publicidad);
        }

        // GET: Publicidad/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Publicidad/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("PublicidadId,CiudadanoId,Folio,Nombre,Tamaño,Notas,TipoPublicidadId,OrigenId,Barda_Lona,ColoniaId,CalleId,NumExterior,NumInterior,Cp,Distrito,Seccion,Estatus,Campo1,Campo2,Latitud,Longitud,FechaRegistro,FechaUltimoCambio,UsuarioRegistroId,DiputadoId,FechaInstalacion,FechaRetiro,Responsable")] Publicidad publicidad)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            if (ModelState.IsValid)
            {
                _context.Add(publicidad);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(publicidad);
        }

        // GET: Publicidad/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var publicidad = await _context.Publicidad.FindAsync(id);
            if (publicidad == null)
            {
                return NotFound();
            }
            return View(publicidad);
        }

        // POST: Publicidad/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("PublicidadId,CiudadanoId,Folio,Nombre,Tamaño,Notas,TipoPublicidadId,OrigenId,Barda_Lona,ColoniaId,CalleId,NumExterior,NumInterior,Cp,Distrito,Seccion,Estatus,Campo1,Campo2,Latitud,Longitud,FechaRegistro,FechaUltimoCambio,UsuarioRegistroId,DiputadoId,FechaInstalacion,FechaRetiro,Responsable")] Publicidad publicidad)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            if (id != publicidad.PublicidadId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(publicidad);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PublicidadExists(publicidad.PublicidadId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(publicidad);
        }

        // GET: Publicidad/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            if (id == null)
            {
                return NotFound();
            }

            var publicidad = await _context.Publicidad
                .FirstOrDefaultAsync(m => m.PublicidadId == id);
            if (publicidad == null)
            {
                return NotFound();
            }

            return View(publicidad);
        }

        // POST: Publicidad/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var publicidad = await _context.Publicidad.FindAsync(id);
            _context.Publicidad.Remove(publicidad);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool PublicidadExists(int id)
        {
            return _context.Publicidad.Any(e => e.PublicidadId == id);
        }


        /************************************************************
            Inserta Nueva Publicidad
        *************************************************************/
        [HttpPost]
        public int InsertaNuevaPublicidad(string folioPublicidad, int tipoPublicidadId, int origenPublicidadId, string tamañoPublicidad, int ciudadanoId, int coloniaId, int calleId, string numExteriorPublicidad, int cp, string latitudPub, string longitudPub, string notasPublicidad)
        {

            if (!User.Identity.IsAuthenticated)
            {
                return 0;
            }

            int DiputadoId = 8;

            Publicidad publicidad = new Publicidad();
            publicidad.CiudadanoId = ciudadanoId;
            publicidad.Folio = folioPublicidad ?? "";
            publicidad.Nombre = "";
            publicidad.Tamaño = tamañoPublicidad ?? "";
            publicidad.Notas = notasPublicidad ?? "";
            publicidad.TipoPublicidadId = tipoPublicidadId;
            publicidad.OrigenId = origenPublicidadId;
            publicidad.Barda_Lona = 0;
            publicidad.ColoniaId = coloniaId;
            publicidad.CalleId = calleId;
            publicidad.NumExterior = numExteriorPublicidad ?? "";
            publicidad.Cp = cp;
            publicidad.Distrito = "V";
            publicidad.Seccion = "";
            publicidad.Estatus = 1;
            publicidad.Campo1 = "";
            publicidad.Campo2 = 0;
            publicidad.Latitud = latitudPub;
            publicidad.Longitud = longitudPub;
            publicidad.FechaRegistro = DateTime.Now;
            publicidad.FechaUltimoCambio = DateTime.Now;

            string idU = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var idUsr = Int32.Parse(idU);
            publicidad.UsuarioRegistroId = idUsr;
            publicidad.DiputadoId = DiputadoId;
            //publicidad.FechaInstalacion= fechaInstalacion == null ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaInstalacion + " 00:00:00");
            //publicidad.FechaRetiro = fechaRetiro == null ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaRetiro + " 00:00:00");
            publicidad.Responsable = "";

            try
            {
                _context.Publicidad.Add(publicidad);
                _context.SaveChanges();

                if (publicidad.PublicidadId != 0)
                {
                    return publicidad.PublicidadId;

                }
                else
                {
                    Console.WriteLine("No se insertó en la BD el registro de publicidad");
                    return -1;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Insertar un registro de publicidad: {0}", e.Message);
                return -1;
            }
        }

        /************************************************************
            Actualiza Nueva Publicidad
        *************************************************************/
        [HttpPost]
        public int ActualizaPublicidad(int publicidadId, string folioPublicidad, int tipoPublicidadId, int origenPublicidadId, string tamañoPublicidad, int ciudadanoId, int coloniaId, int calleId, string numExteriorPublicidad, int cp, string latitudPub, string longitudPub, string notasPublicidad)
        {

            if (!User.Identity.IsAuthenticated)
            {
                return 0;
            }

            int DiputadoId = 8;

            Publicidad publicidad = _context.Publicidad.Where(p => p.PublicidadId == publicidadId).FirstOrDefault();

            publicidad.CiudadanoId = ciudadanoId;
            publicidad.Folio = folioPublicidad ?? "";
            publicidad.Nombre = "";
            publicidad.Tamaño = tamañoPublicidad ?? "";
            publicidad.Notas = notasPublicidad ?? "";
            publicidad.TipoPublicidadId = tipoPublicidadId;
            publicidad.OrigenId = origenPublicidadId;
            publicidad.Barda_Lona = 0;
            publicidad.ColoniaId = coloniaId;
            publicidad.CalleId = calleId;
            publicidad.NumExterior = numExteriorPublicidad ?? "";
            publicidad.Cp = cp;
            publicidad.Distrito = "V";
            publicidad.Seccion = "";
            publicidad.Estatus = 1;
            publicidad.Campo1 = "";
            publicidad.Campo2 = 0;
            publicidad.Latitud = latitudPub ?? "";
            publicidad.Longitud = longitudPub ?? "";
            publicidad.FechaUltimoCambio = DateTime.Now;

            string idU = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var idUsr = Int32.Parse(idU);
            publicidad.DiputadoId = DiputadoId;
            publicidad.Responsable = "";

            try
            {
                _context.Publicidad.Update(publicidad);
                _context.SaveChanges();

                if (publicidad.PublicidadId != 0)
                {
                    return publicidad.PublicidadId;

                }
                else
                {
                    Console.WriteLine("No se insertó en la BD Actualización de publicidad");
                    return -1;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Insertar un registro de Actualziación en publicidad: {0}", e.Message);
                return -1;
            }
        }

        /****************************************************************************
            Obtiene Listado de PUBLICIDAD 
        *****************************************************************************/
        [HttpGet]
        public IEnumerable<ObjetoPublicidad> ObtieneListadoPublicidad()
        {
            IEnumerable<ObjetoPublicidad> ListaObjetos = new List<ObjetoPublicidad>();
            ListaObjetos = (IEnumerable<ObjetoPublicidad>)(
                    from publicidad in _context.Publicidad
                    select new ObjetoPublicidad
                    {
                        PublicidadBase = new Publicidad
                        {
                            PublicidadId = publicidad.PublicidadId,
                            CiudadanoId = publicidad.CiudadanoId,
                            TipoPublicidadId = publicidad.TipoPublicidadId,
                            Folio = publicidad.Folio,
                            Tamaño = publicidad.Tamaño,
                            CalleId = publicidad.CalleId,
                            ColoniaId = publicidad.ColoniaId,
                            NumExterior = publicidad.NumExterior,
                            NumInterior = publicidad.NumInterior,
                            FechaRegistro = publicidad.FechaRegistro,
                            FechaInstalacion = publicidad.FechaInstalacion,
                            FechaRetiro = publicidad.FechaRetiro,
                            Estatus = publicidad.Estatus,
                            Notas = publicidad.Notas,
                            Nombre = publicidad.Nombre,
                            Responsable = publicidad.Responsable
                        },
                        NombreCiudadano = _context.Ciudadanos.Where(c => c.CiudadanoId == publicidad.CiudadanoId).Select(c => c.Nombre + " " + c.Paterno + " " + c.Materno).FirstOrDefault(),
                        NombreColonia = _context.Colonias.Where(c => c.ColoniaId == publicidad.ColoniaId).Select(c => c.NombreColonia).FirstOrDefault(),
                        NombreCalle = _context.Calles.Where(c => c.CalleId == publicidad.CalleId).Select(c => c.NombreCalle).FirstOrDefault(),
                        TipoPublicidad = _context.TipoPublicidad.Where(p => p.TipoPublicidadId == publicidad.TipoPublicidadId).Select(p => p.Nombre).FirstOrDefault(),
                        OrigenPublicidad = _context.OrigenPublicidad.Where(o => o.OrigenPublicidadId == publicidad.OrigenId).Select(o => o.Nombre).FirstOrDefault(),

                        ArchivosRelacionadosPublicidad = (List<ArchivosPublicidad>)(
                            from archivoPublicidad in _context.ArchivosPublicidad.Where(ap => ap.PublicidadId == publicidad.PublicidadId)
                            select new ArchivosPublicidad
                            {
                                ArchivosPublicidadId = archivoPublicidad.ArchivosPublicidadId,
                                PublicidadId = archivoPublicidad.PublicidadId,
                                NombreArchivo = archivoPublicidad.NombreArchivo,
                                Url = archivoPublicidad.Url
                            }
                        )
                    });
            return ListaObjetos;
        }

        /****************************************************************************
            Obtiene Listado de PUBLICIDAD 
        *****************************************************************************/
        [HttpGet]
        public IEnumerable<ObjetoPublicidad> ObtieneListadoPublicidad_2(int RegXpag, int offsetPeticiones, string Folio, string TamañoPub, string Ciudadano, string Colonia, string Calle, int TipoPub, int OrigenPub)
        {
            IEnumerable<ObjetoPublicidad> ListaObjetos = new List<ObjetoPublicidad>();
            ListaObjetos = (IEnumerable<ObjetoPublicidad>)(
                    from publicidad in _context.Publicidad
                    join colonias in _context.Colonias on publicidad.ColoniaId equals colonias.ColoniaId
                    join ciudadano in _context.Ciudadanos on publicidad.CiudadanoId equals ciudadano.CiudadanoId
                    join calles in _context.Calles on publicidad.CalleId equals calles.CalleId
                    join tipoPub in _context.TipoPublicidad on publicidad.TipoPublicidadId equals tipoPub.TipoPublicidadId
                    //join origenPub in _context.OrigenPublicidad on publicidad.OrigenId equals origenPub.OrigenPublicidadId

                    where true && String.IsNullOrEmpty(Folio) ? (true) : publicidad.Folio.Contains(Folio)
                    where true && String.IsNullOrEmpty(TamañoPub) ? (true) : publicidad.Tamaño.Contains(TamañoPub)
                    where true && String.IsNullOrEmpty(Ciudadano) ? (true) : ciudadano.NombreCompleto.Contains(Ciudadano)
                    where true && String.IsNullOrEmpty(Colonia) ? (true) : colonias.NombreColonia.Contains(Colonia)
                    where true && String.IsNullOrEmpty(Calle) ? (true) : calles.NombreCalle.Contains(Calle)

                    where true && (TipoPub == 0) ? (true) : publicidad.TipoPublicidadId == TipoPub
                    where true && (OrigenPub == 0) ? (true) : publicidad.OrigenId == OrigenPub

                    orderby ciudadano.NombreCompleto ascending
                    select new ObjetoPublicidad
                    {
                        PublicidadBase = new Publicidad
                        {
                            PublicidadId = publicidad.PublicidadId,
                            CiudadanoId = publicidad.CiudadanoId,
                            TipoPublicidadId = publicidad.TipoPublicidadId,
                            Folio = publicidad.Folio,
                            Tamaño = publicidad.Tamaño,
                            CalleId = publicidad.CalleId,
                            ColoniaId = publicidad.ColoniaId,
                            NumExterior = publicidad.NumExterior,
                            NumInterior = publicidad.NumInterior,
                            FechaRegistro = publicidad.FechaRegistro,
                            FechaInstalacion = publicidad.FechaInstalacion,
                            FechaRetiro = publicidad.FechaRetiro,
                            Estatus = publicidad.Estatus,
                            Notas = publicidad.Notas,
                            Nombre = publicidad.Nombre,
                            Responsable = publicidad.Responsable
                        },
                        NombreCiudadano = _context.Ciudadanos.Where(c => c.CiudadanoId == publicidad.CiudadanoId).Select(c => c.Nombre + " " + c.Paterno + " " + c.Materno).FirstOrDefault(),
                        NombreColonia = _context.Colonias.Where(c => c.ColoniaId == publicidad.ColoniaId).Select(c => c.NombreColonia).FirstOrDefault(),
                        NombreCalle = _context.Calles.Where(c => c.CalleId == publicidad.CalleId).Select(c => c.NombreCalle).FirstOrDefault(),
                        TipoPublicidad = _context.TipoPublicidad.Where(p => p.TipoPublicidadId == publicidad.TipoPublicidadId).Select(p => p.Nombre).FirstOrDefault(),
                        OrigenPublicidad = _context.OrigenPublicidad.Where(o => o.OrigenPublicidadId == publicidad.OrigenId).Select(o => o.Nombre).FirstOrDefault(),

                        ArchivosRelacionadosPublicidad = (List<ArchivosPublicidad>)(
                            from archivoPublicidad in _context.ArchivosPublicidad.Where(ap => ap.PublicidadId == publicidad.PublicidadId)
                            select new ArchivosPublicidad
                            {
                                ArchivosPublicidadId = archivoPublicidad.ArchivosPublicidadId,
                                PublicidadId = archivoPublicidad.PublicidadId,
                                NombreArchivo = archivoPublicidad.NombreArchivo,
                                Url = archivoPublicidad.Url
                            }
                        )
                    }).Skip(offsetPeticiones).Take(RegXpag); ;
            return ListaObjetos;
        }


        /****************************************************************************
            Obtiene Número de Registros de PUBLICIDAD con FILTRO
        *****************************************************************************/
        [HttpGet]
        public int ObtieneNumPublicidadFiltrados(string Folio, string TamañoPub, string Ciudadano, string Colonia, string Calle, int TipoPub, int OrigenPub)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return 0;
            }

            var results =
                    from publicidad in _context.Publicidad
                    join colonias in _context.Colonias on publicidad.ColoniaId equals colonias.ColoniaId
                    join ciudadano in _context.Ciudadanos on publicidad.CiudadanoId equals ciudadano.CiudadanoId
                    join calles in _context.Calles on publicidad.CalleId equals calles.CalleId
                    join tipoPub in _context.TipoPublicidad on publicidad.TipoPublicidadId equals tipoPub.TipoPublicidadId
                    //join origenPub in _context.OrigenPublicidad on publicidad.OrigenId equals origenPub.OrigenPublicidadId

                    where true && String.IsNullOrEmpty(Folio) ? (true) : publicidad.Folio.Contains(Folio)
                    where true && String.IsNullOrEmpty(TamañoPub) ? (true) : publicidad.Tamaño.Contains(TamañoPub)
                    where true && String.IsNullOrEmpty(Ciudadano) ? (true) : ciudadano.NombreCompleto.Contains(Ciudadano)
                    where true && String.IsNullOrEmpty(Colonia) ? (true) : colonias.NombreColonia.Contains(Colonia)
                    where true && String.IsNullOrEmpty(Calle) ? (true) : calles.NombreCalle.Contains(Calle)

                    where true && (TipoPub == 0) ? (true) : publicidad.TipoPublicidadId == TipoPub
                    where true && (OrigenPub == 0) ? (true) : publicidad.OrigenId == OrigenPub

                    select publicidad.PublicidadId;

            return results.Count();
        }
        /*******************************************************************
            Obtiene el número de Registros de Publicidad
        ********************************************************************/
        public Int32 numeroPublicidad()
        {
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[Publicidad] WHERE Estatus=1";
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }

        /****************************************************************************
            Obtiene Datos de PUBLICIDAD con publicidadId
        *****************************************************************************/
        [HttpGet]
        public ObjetoPublicidad GetDatosPublicidad(int publicidadId)
        {
            ObjetoPublicidad Objeto = new ObjetoPublicidad();

            Objeto = _context.Publicidad.Where(p => p.PublicidadId == publicidadId).Select(pu =>

                     new ObjetoPublicidad
                     {
                         PublicidadBase = new Publicidad
                         {
                             PublicidadId = pu.PublicidadId,
                             TipoPublicidadId = pu.TipoPublicidadId,
                             Folio = pu.Folio,
                             Tamaño = pu.Tamaño,
                             CalleId = pu.CalleId,
                             ColoniaId = pu.ColoniaId,
                             NumExterior = pu.NumExterior,
                             NumInterior = pu.NumInterior,
                             FechaRegistro = pu.FechaRegistro,
                             FechaInstalacion = pu.FechaInstalacion,
                             FechaRetiro = pu.FechaRetiro,
                             Estatus = pu.Estatus,
                             Notas = pu.Notas,
                             Nombre = pu.Nombre,
                             Responsable = pu.Responsable,
                             OrigenId = pu.OrigenId,
                             CiudadanoId = pu.CiudadanoId,
                             Latitud = pu.Latitud,
                             Longitud = pu.Longitud,
                             Cp = pu.Cp
                         },
                         NombreCiudadano = _context.Ciudadanos.Where(c => c.CiudadanoId == pu.CiudadanoId).Select(c => c.Nombre + " " + c.Paterno + " " + c.Materno).FirstOrDefault(),
                         NombreColonia = _context.Colonias.Where(c => c.ColoniaId == pu.ColoniaId).Select(c => c.NombreColonia).FirstOrDefault(),
                         NombreCalle = _context.Calles.Where(c => c.CalleId == pu.CalleId).Select(c => c.NombreCalle).FirstOrDefault(),
                         TipoPublicidad = _context.TipoPublicidad.Where(p => p.TipoPublicidadId == p.TipoPublicidadId).Select(p => p.Nombre).FirstOrDefault(),
                         OrigenPublicidad = _context.OrigenPublicidad.Where(o => o.OrigenPublicidadId == pu.OrigenId).Select(o => o.Nombre).FirstOrDefault()
                     }).FirstOrDefault();
            return Objeto;
        }

        /****************************************************************************
            Obtiene Fotos de publicidadId de un Ciudadano
        *****************************************************************************/
        [HttpGet]
        public IEnumerable<ArchivosPublicidad> ObtieneFotosPublicidad(int publicidadId)
        {
            IEnumerable<ArchivosPublicidad> ListaObjetos = new List<ArchivosPublicidad>();
            ListaObjetos = (IEnumerable<ArchivosPublicidad>)(
                    from archivo in _context.ArchivosPublicidad.Where(a=>a.PublicidadId==publicidadId)
                    select new ArchivosPublicidad
                    {
                        NombreArchivo = archivo.NombreArchivo,
                        Url = archivo.Url,
                        Estatus = archivo.Estatus,
                        Nota = archivo.Nota
                    });
            return ListaObjetos;
        }

        /****************************************************************************
            Obtiene Listado de PUBLICIDAD X persona
        *****************************************************************************/
        [HttpGet]
        public IEnumerable<ObjetoPublicidad> ObtieneListadoPublicidadXciudadano(int idCiudadano)
        {
            IEnumerable<ObjetoPublicidad> ListaObjetos = new List<ObjetoPublicidad>();
            ListaObjetos = (IEnumerable<ObjetoPublicidad>)(
                    from publicidad in _context.Publicidad.Where(p=>p.CiudadanoId== idCiudadano)
                    join colonias in _context.Colonias on publicidad.ColoniaId equals colonias.ColoniaId
                    join ciudadano in _context.Ciudadanos on publicidad.CiudadanoId equals ciudadano.CiudadanoId
                    join calles in _context.Calles on publicidad.CalleId equals calles.CalleId
                    join tipoPub in _context.TipoPublicidad on publicidad.TipoPublicidadId equals tipoPub.TipoPublicidadId
                    join origenPub in _context.OrigenPublicidad on publicidad.OrigenId equals origenPub.OrigenPublicidadId

                    select new ObjetoPublicidad
                    {
                        PublicidadBase = new Publicidad
                        {
                            PublicidadId = publicidad.PublicidadId,
                            CiudadanoId = publicidad.CiudadanoId,
                            TipoPublicidadId = publicidad.TipoPublicidadId,
                            Folio = publicidad.Folio,
                            Tamaño = publicidad.Tamaño,
                            CalleId = publicidad.CalleId,
                            ColoniaId = publicidad.ColoniaId,
                            NumExterior = publicidad.NumExterior,
                            NumInterior = publicidad.NumInterior,
                            FechaRegistro = publicidad.FechaRegistro,
                            FechaInstalacion = publicidad.FechaInstalacion,
                            FechaRetiro = publicidad.FechaRetiro,
                            Estatus = publicidad.Estatus,
                            Notas = publicidad.Notas,
                            Nombre = publicidad.Nombre,
                            Responsable = publicidad.Responsable
                        },
                        NombreCiudadano = _context.Ciudadanos.Where(c => c.CiudadanoId == publicidad.CiudadanoId).Select(c => c.Nombre + " " + c.Paterno + " " + c.Materno).FirstOrDefault(),
                        NombreColonia = _context.Colonias.Where(c => c.ColoniaId == publicidad.ColoniaId).Select(c => c.NombreColonia).FirstOrDefault(),
                        NombreCalle = _context.Calles.Where(c => c.CalleId == publicidad.CalleId).Select(c => c.NombreCalle).FirstOrDefault(),
                        TipoPublicidad = _context.TipoPublicidad.Where(p => p.TipoPublicidadId == publicidad.TipoPublicidadId).Select(p => p.Nombre).FirstOrDefault(),
                        OrigenPublicidad = _context.OrigenPublicidad.Where(o => o.OrigenPublicidadId == publicidad.OrigenId).Select(o => o.Nombre).FirstOrDefault(),

                        ArchivosRelacionadosPublicidad = (List<ArchivosPublicidad>)(
                            from archivoPublicidad in _context.ArchivosPublicidad.Where(ap => ap.PublicidadId == publicidad.PublicidadId)
                            select new ArchivosPublicidad
                            {
                                ArchivosPublicidadId = archivoPublicidad.ArchivosPublicidadId,
                                PublicidadId = archivoPublicidad.PublicidadId,
                                NombreArchivo = archivoPublicidad.NombreArchivo,
                                Url = archivoPublicidad.Url
                            }
                        )
                    });
            return ListaObjetos;
        }
        /************************************************************
                    BORRAR Archivo de PUBLICIDAD
        *************************************************************/
        [HttpDelete]
        public int BorrarArchivoPublicidad(int archivosPublicidadId)
        {
            var valReturn = 0;
            try
            {
                var archivoPublicidadObj = _context.ArchivosPublicidad.Find(archivosPublicidadId);
                _context.ArchivosPublicidad.Remove(archivoPublicidadObj);
                _context.SaveChanges();

                valReturn = 1;
            }
            catch
            {
                valReturn = 0;
            }

            return valReturn;
        }

        /*******************************************************************
            Obtiene el número de Archivos Publicidad ID 
        ********************************************************************/
        public Int32 numeroArchivosXpublicidadId(int idDocumento)
        {
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[ArchivosPublicidad] WHERE PublicidadId = " + idDocumento;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }

        /****************************************************************************
                    Subir Archivos Anexos de Publicidad
        *****************************************************************************/
        [Microsoft.AspNetCore.Mvc.HttpPost]
        [RequestSizeLimit(100_000_000)]
        public Microsoft.AspNetCore.Mvc.JsonResult SubirArchivoPublicidad(List<IFormFile> files, int PublicidadId, int CiudadanoId)
        {
            bool isSuccess = false;
            string serverMessage;
            string nombreArchivoBD;
            string nombreArchivo;
            string extensionArchivo;
            string filePath;
            int posicionPunto;
            foreach (IFormFile item in files)
            {
                if (item.Length > 0)
                {
                    //subPath = numeroTurno;
                    nombreArchivo = item.FileName;
                    posicionPunto = item.FileName.IndexOf(".");
                    extensionArchivo = item.FileName.Substring(posicionPunto + 1);

                    nombreArchivoBD = TokenProvider.ComputeSha256Hash(Convert.ToString(PublicidadId) + "_" + numeroArchivosXpublicidadId(PublicidadId)) + "." + extensionArchivo;

                    filePath = Path.Combine(@"C:\ARCHIVOS_APP\PETICIONES\PUBLICIDAD\", nombreArchivoBD);

                    FileInfo fi = new FileInfo(filePath);

                    try
                    {
                        if (fi.Exists)
                        {
                            fi.Delete();
                        }
                    }
                    catch (Exception e)
                    {
                        ViewBag.EstatusError = "Si el archivo está abierto, debe cerrarse";
                        View("Error");
                    }

                    try
                    {
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            item.CopyTo(stream);
                        }
                        var URL = "/Archivos/PETICIONES/PUBLICIDAD/" + nombreArchivoBD;

                        GuardaReferenciaArchivoPublicidadBD(nombreArchivo, nombreArchivoBD, URL, PublicidadId, CiudadanoId);

                    }
                    catch
                    {
                        isSuccess = false;
                    }

                }
            }


            if (isSuccess)
            {
                isSuccess = true;
                serverMessage = "Los archivos han sido subidos";
            }
            else
            {
                isSuccess = false;

                serverMessage = "No fue posible subir los archivos";
            }
            return Json(new { IsSucccess = isSuccess, ServerMessage = serverMessage });
        }

        /****************************************************************************
            Guarda Referencia de Archivos de PUBLICIDAD en Base de Datos
        *****************************************************************************/
        public string GuardaReferenciaArchivoPublicidadBD(string NombreArchivo, string NombreArchivoBD, string URL, int PublicidadId, int CiudadanoId)
        {
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpRegistraNuevoArchivoPublicidad";
            cmd.Parameters.Add("@NombreArchivoBD", System.Data.SqlDbType.VarChar, 150).Value = NombreArchivoBD;
            cmd.Parameters.Add("@NombreArchivo", System.Data.SqlDbType.VarChar, 200).Value = NombreArchivo;
            cmd.Parameters.Add("@URL", System.Data.SqlDbType.VarChar, 500).Value = URL;
            cmd.Parameters.Add("@PublicidadId", System.Data.SqlDbType.Int).Value = PublicidadId;
            cmd.Parameters.Add("@CiudadanoId", System.Data.SqlDbType.Int).Value = CiudadanoId;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 1;

            try
            {
                SqlDataReader query = cmd.ExecuteReader();
                conn.Close();

                return "OK";
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return "NO";
            }
        }

        /****************************************************************************
                Ubicación de Publicidad
         *****************************************************************************/
        public string UbicacionPublicidad()
        {
            string markers = "[";
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            //string stm = "SELECT NombreCompleto, Latitud, Longitud, Afin, telefono, URL, CiudadanoId FROM Ciudadanos WHERE Latitud IS NOT NULL  AND Longitud IS NOT NULL";
            string stm = "SELECT P.Folio, CONCAT(C.Nombre, ' ', C.Paterno, ' ', C.Materno) AS Nombre, P.Tamaño, P.Notas, CO.NombreColonia, CA.NombreCalle, P.NumExterior, P.CP, P.Latitud, P.Longitud, C.URL, C.CiudadanoID, C.telefono, TP.Nombre AS TipoPub, ISNULL(PA.Nombre,'') AS partido, ISNULL(PA.Logotipo,'') AS logo, C.DDigital AS digital";
            stm += " FROM Publicidad AS P ";
            stm += " LEFT JOIN Ciudadanos AS C ON C.CiudadanoID = P.CiudadanoID ";
            stm += " LEFT JOIN TipoPublicidad AS TP ON TP.TipoPublicidadID = P.TipoPublicidadID ";
            stm += " LEFT JOIN Colonias AS CO ON CO.ColoniaID = P.ColoniaID ";
            stm += " LEFT JOIN Calles AS CA ON CA.CalleID = P.CalleID ";
            stm += " LEFT JOIN CatPartidos AS PA ON PA.PartidoID = C.PartidoID ";

            var indice = 0;
            using (SqlCommand cmd = new SqlCommand(stm, conn_p))
            {
                using (SqlDataReader sdr = cmd.ExecuteReader())
                {
                    while (sdr.Read())
                    {
                        if (indice > 0)
                        {
                            markers += ",{";
                        }
                        else
                        {
                            markers += "{";
                        }
                        indice++;
                        markers += string.Format("\"folio\": \"{0}\",", sdr["Folio"]);
                        markers += string.Format("\"nombre\": \"{0}\",", sdr["Nombre"]);
                        markers += string.Format("\"tamaño\": \"{0}\",", sdr["Tamaño"]);
                        markers += string.Format("\"notas\": \"{0}\",", sdr["Notas"]);
                        markers += string.Format("\"colonia\": \"{0}\",", sdr["NombreColonia"]);
                        markers += string.Format("\"calle\": \"{0}\",", sdr["NombreCalle"]);
                        markers += string.Format("\"numero\": \"{0}\",", sdr["NumExterior"]);
                        markers += string.Format("\"cp\": \"{0}\",", sdr["CP"]);
                        markers += string.Format("\"latitud\": \"{0}\",", sdr["Latitud"]);
                        markers += string.Format("\"longitud\": \"{0}\",", sdr["Longitud"]);
                        markers += string.Format("\"url\": \"{0}\",", sdr["URL"]);
                        markers += string.Format("\"ciudadanoId\": \"{0}\",", sdr["CiudadanoID"]);
                        markers += string.Format("\"telefono\": \"{0}\",", sdr["telefono"]);
                        markers += string.Format("\"tipoPub\": \"{0}\",", sdr["tipoPub"]);
                        markers += string.Format("\"partido\": \"{0}\",", sdr["partido"]);
                        markers += string.Format("\"digital\": \"{0}\",", sdr["digital"]);
                        markers += string.Format("\"logo\": \"{0}\"", sdr["logo"]);
                        markers += "}";
                    }
                    
                }
                conn_p.Close();
            }

            return markers += "]";
        }


        /****************************************************************************
                Ubicación de Publicidad
         *****************************************************************************/
        public string UbicacionPublicidad_2()
        {
            string markers = "[";
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            //string stm = "SELECT P.Folio, CONCAT(C.Nombre, ' ', C.Paterno, ' ', C.Materno) AS Nombre, P.Tamaño, P.Notas, CO.NombreColonia, CA.NombreCalle, P.NumExterior, P.CP, P.Latitud, P.Longitud, C.URL, C.CiudadanoID, C.telefono, TP.Nombre AS TipoPub, ISNULL(PA.Nombre,'') AS partido, ISNULL(PA.Logotipo,'') AS logo ";
            //stm += " FROM Publicidad AS P ";
            //stm += " LEFT JOIN Ciudadanos AS C ON C.CiudadanoID = P.CiudadanoID ";
            //stm += " LEFT JOIN TipoPublicidad AS TP ON TP.TipoPublicidadID = P.TipoPublicidadID ";
            //stm += " LEFT JOIN Colonias AS CO ON CO.ColoniaID = P.ColoniaID ";
            //stm += " LEFT JOIN Calles AS CA ON CA.CalleID = P.CalleID ";
            //stm += " LEFT JOIN CatPartidos AS PA ON PA.PartidoID = C.PartidoID ";

             
            string stm = "SELECT P.Folio AS Folio, CONCAT(C.Nombre, ' ', C.Paterno, ' ', C.Materno) AS Nombre, P.Tamaño, P.Notas, CO.NombreColonia, CA.NombreCalle, P.NumExterior, P.CP, P.Latitud, P.Longitud, C.URL, C.CiudadanoID, C.telefono, TP.Nombre AS TipoPub, ISNULL(PA.Nombre, '') AS partido, ISNULL(PA.Logotipo, '') AS logo, C.afin, 'Promocional' AS tipoDato, '/Apoyo/images/b.svg' AS icono, 1 AS escala, C.DDigital AS digital";
            stm += ", 0 AS lider ";

            stm += " FROM Publicidad AS P ";
            stm += " LEFT JOIN Ciudadanos AS C ON C.CiudadanoID = P.CiudadanoID ";
            stm += " LEFT JOIN TipoPublicidad AS TP ON TP.TipoPublicidadID = P.TipoPublicidadID ";
            stm += " LEFT JOIN Colonias AS CO ON CO.ColoniaID = P.ColoniaID ";
            stm += " LEFT JOIN Calles AS CA ON CA.CalleID = P.CalleID ";
            stm += " LEFT JOIN CatPartidos AS PA ON PA.PartidoID = C.PartidoID ";

            stm += " union ";

            stm += " SELECT '' AS Folio,C.NombreCompleto AS Nombre, '' AS Tamaño, '' AS Notas, ISNULL(CO.NombreColonia, '') AS NombreColonia, ISNULL(CA.NombreCalle, '') AS NombreCalle, ";
            stm += "   ISNULL(C.NumExterior, '') AS NumExterior, C.CP AS CP, C.Latitud AS Latitud, C.Longitud AS Longitud,  C.URL AS URL, C.CiudadanoId AS CiudadanoId, C.telefono AS telefono,  ";
            stm += " '', PA.Nombre AS partido, PA.Logotipo AS logo, C.Afin AS Afin, 'Ciudadano' AS tipoDato, CASE C.Afin WHEN 1 THEN '/Apoyo/images/turqueza.png' WHEN 0 THEN 'https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg' END AS icono, 2 AS escala, C.DDigital AS digital ";
            stm += ", (SELECT COUNT(CiudadanoID) FROM IntegrantesAsociacion WHERE CiudadanoID=C.CiudadanoId AND Representante=1) AS lider ";

            stm += "   FROM Ciudadanos AS C ";
            stm += "   LEFT JOIN Colonias AS CO ON CO.ColoniaID = C.ColoniaID ";
            stm += "   LEFT JOIN Calles AS CA ON CA.CalleID = C.CalleID ";
            stm += "   LEFT JOIN CatPartidos AS PA ON PA.PartidoID = C.PartidoID ";
            stm += "   WHERE Latitud IS NOT NULL AND Longitud IS NOT NULL ";

            var indice = 0;
            using (SqlCommand cmd = new SqlCommand(stm, conn_p))
            {
                using (SqlDataReader sdr = cmd.ExecuteReader())
                {
                    while (sdr.Read())
                    {
                        if (indice > 0)
                        {
                            markers += ",{";
                        }
                        else
                        {
                            markers += "{";
                        }
                        indice++;
                        markers += string.Format("\"folio\": \"{0}\",", sdr["Folio"]);
                        markers += string.Format("\"nombre\": \"{0}\",", sdr["Nombre"]);
                        markers += string.Format("\"tamaño\": \"{0}\",", sdr["Tamaño"]);
                        markers += string.Format("\"notas\": \"{0}\",", sdr["Notas"]);
                        markers += string.Format("\"colonia\": \"{0}\",", sdr["NombreColonia"]);
                        markers += string.Format("\"calle\": \"{0}\",", sdr["NombreCalle"]);
                        markers += string.Format("\"numero\": \"{0}\",", sdr["NumExterior"]);
                        markers += string.Format("\"cp\": \"{0}\",", sdr["CP"]);
                        markers += string.Format("\"latitud\": \"{0}\",", sdr["Latitud"]);
                        markers += string.Format("\"longitud\": \"{0}\",", sdr["Longitud"]);
                        markers += string.Format("\"url\": \"{0}\",", sdr["URL"]);
                        markers += string.Format("\"ciudadanoId\": \"{0}\",", sdr["CiudadanoID"]);
                        markers += string.Format("\"telefono\": \"{0}\",", sdr["telefono"]);
                        markers += string.Format("\"tipoPub\": \"{0}\",", sdr["tipoPub"]);
                        markers += string.Format("\"partido\": \"{0}\",", sdr["partido"]);
                        markers += string.Format("\"logo\": \"{0}\",", sdr["logo"]);
                        markers += string.Format("\"tipoDato\": \"{0}\",", sdr["tipoDato"]);
                        markers += string.Format("\"icono\": \"{0}\",", sdr["icono"]);
                        markers += string.Format("\"escala\": \"{0}\",", sdr["escala"]);
                        markers += string.Format("\"digital\": \"{0}\",", sdr["digital"]);
                        markers += string.Format("\"lider\": \"{0}\",", sdr["lider"]);
                        markers += string.Format("\"afin\": \"{0}\"", sdr["afin"]);
                        markers += "}";
                    }

                }
                conn_p.Close();
            }

            return markers += "]";
        }

        /****************************************************************************
                Publicidad X Ciudadano
         *****************************************************************************/
        public ObjPubliCiudadano PublicidadXciudadano(int ciudadanoId)
        {
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            //string stm = "SELECT NombreCompleto, Latitud, Longitud, Afin, telefono, URL, CiudadanoId FROM Ciudadanos WHERE Latitud IS NOT NULL  AND Longitud IS NOT NULL";
            string stm = "SELECT P.Folio, CONCAT(C.Nombre, ' ', C.Paterno, ' ', C.Materno) AS Nombre, P.Tamaño, P.Notas, CO.NombreColonia, CA.NombreCalle, P.NumExterior, P.CP, P.Latitud, P.Longitud, C.URL, C.CiudadanoID, C.telefono, TP.Nombre AS TipoPub  ";
            stm += " FROM Publicidad AS P ";
            stm += " LEFT JOIN Ciudadanos AS C ON C.CiudadanoID = P.CiudadanoID ";
            stm += " LEFT JOIN TipoPublicidad AS TP ON TP.TipoPublicidadID = P.TipoPublicidadID ";
            stm += " LEFT JOIN Colonias AS CO ON CO.ColoniaID = P.ColoniaID ";
            stm += " LEFT JOIN Calles AS CA ON CA.CalleID = P.CalleID ";
            stm += " Where  P.CiudadanoID = " + ciudadanoId;

            ObjPubliCiudadano obj = new ObjPubliCiudadano();
            using (SqlCommand cmd = new SqlCommand(stm, conn_p))
            {
                using (SqlDataReader sdr = cmd.ExecuteReader())
                {
                    sdr.Read();

                    obj.Folio = (string) sdr["Folio"];
                    obj.Nombre = (string)sdr["Nombre"];
                    obj.Tamaño = (string)sdr["Tamaño"];
                    obj.Notas = (string)sdr["Notas"];
                    obj.NombreColonia = (string)sdr["NombreColonia"];
                    obj.NombreCalle = (string)sdr["NombreCalle"];
                    obj.NumExterior = (string)sdr["NumExterior"];
                    obj.URL = (string)sdr["URL"];
                    obj.Telefono = (string)sdr["telefono"];
                    obj.TipoPublicidad = (string)sdr["tipoPub"];
                    obj.CP = (int)sdr["CP"];
                }
                conn_p.Close();
            }

            return obj;
        }


        /****************************************************************************
                Elimina Registro de Publicidad
         *****************************************************************************/
        [HttpDelete]
        public int EliminaPublicidad(int publicidadId)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return 3;
            }

            //int contador_1 = _context.ObligClientes.Where(oc => oc.TipoObligacionId == padreId).Count();
            //int contador_2 = _context.OtDeclaraciones.Where(od => od.TipoObligacionId == padreId).Count();

            //if (contador_1 == 0 && contador_2 == 0)
            //{
                try
                {
                    var ListObjHijo = _context.ArchivosPublicidad.Where(o => o.PublicidadId == publicidadId);
                    foreach (ArchivosPublicidad ObjHijo in ListObjHijo)
                    {
                        if (ObjHijo != null)
                        {
                            _context.ArchivosPublicidad.Remove(ObjHijo);
                            //_context.SaveChanges();
                        }
                    }
                _context.SaveChanges();
                //var ObjPadre = _context.CatTipoobligaciones.Find(padreId);
                var ObjPadre = _context.Publicidad.SingleOrDefault(p => p.PublicidadId == publicidadId);
                    if (ObjPadre != null)
                    {
                        _context.Publicidad.Remove(ObjPadre);
                        _context.SaveChanges();
                    }

                }
                catch (DbUpdateConcurrencyException)
                {
                    return 0;
                }
            //}
            //else
            //{
            //    return 2;
            //}

            return 1;
        }

        /********************
         *  OBJETOS
         ********************/
        public partial class ObjPubliCiudadano
        {
            public string Folio { get; set; }
            public string Nombre { get; set; }
            public int CiudadanoId { get; set; }
            public string Tamaño { get; set; }
            public string Notas { get; set; }
            public string NombreColonia { get; set; }
            public string NombreCalle { get; set; }
            public int CP { get; set; }
            public string NumExterior { get; set; }
            public string URL { get; set; }
            public string Telefono { get; set; }
            public string TipoPublicidad { get; set; }

        }

    }
}

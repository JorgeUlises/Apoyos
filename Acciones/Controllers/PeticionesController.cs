using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Acciones.Models;
using Acciones.ViewModel;
using Microsoft.Data.SqlClient;

using System.Data;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Data.Entity.Core.Objects;
using System.Globalization;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
//using System.Data.Entity;

namespace Acciones.Controllers
{
    public class PeticionesController : Controller
    {
        private readonly dbAccionesContext _context;

        public PeticionesController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Peticiones
        //[Authorize]
        public async Task<IActionResult> Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            int DiputadoId = 8;
            var LegId = _context.Legislaturas.Where(l => l.Estatus == 1).Select(l => l.LegislaturaId).SingleOrDefault();
            List<SelectListItem> LLegis = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre").ToList();
            var selected = LLegis.Where(x => x.Value == LegId.ToString()).First();
            selected.Selected = true;
            ViewData["LegBusqueda"] = LLegis;


            List<SelectListItem> Lcat = new SelectList(_context.Categorias, "CategoriaId", "Descripcion").ToList();
            Lcat.Insert(0, new SelectListItem() { Value = "0", Text = "TODO" });
            ViewData["ClasificacionBusqueda"] = Lcat;

            List<SelectListItem> Lorig = new SelectList(_context.OrigenPeticiones, "OrigenPeticionesId", "Nombre").ToList();
            //Lorig.Insert(0, new SelectListItem() { Value = "0", Text = "TODO" });
            ViewData["OrigenBusqueda"] = Lorig;

            List<SelectListItem> Lestatus = new SelectList(_context.EstatusPeticiones, "EstatusPeticionesId", "Nombre").ToList();
            Lestatus.Insert(0, new SelectListItem() { Value = "0", Text = "TODO" });
            ViewData["EstatusBusqueda"] = Lestatus;

            List<SelectListItem> LAsosiaciones = new SelectList(_context.Asociaciones, "AsociacionId", "Nombre").ToList();
            LAsosiaciones.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["AsociacionBusqueda"] = LAsosiaciones;

            List<SelectListItem> LDependencias = new SelectList(_context.Dependencias, "DependenciaId", "NombreDependecia").ToList();
            LDependencias.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["DependenciaBusqueda"] = LDependencias;

            //var dbAccionesContext = _context.Peticiones.Include(p => p.Asociacion).Include(p => p.Dependecia).Include(p => p.Diputado).Include(p => p.EstatusNavigation).Include(p => p.Legislatura).Include(p => p.OrigenPeticion);

            List<SelectListItem> Lresponsables = new SelectList(_context.Usuarios.Where(u => u.Estatus == 1 && u.DiputadoId == DiputadoId && u.RolId == 3), "UsuarioId", "Nombre").ToList();

            Lresponsables.Insert(0, new SelectListItem() { Value = "0", Text = "Sin Asignar" });
            Lresponsables.Insert(0, new SelectListItem() { Value = "-1", Text = "" });

            ViewData["ResponsableBusqueda"] = Lresponsables;


            var dbAccionesContext = _context.Peticiones;
            ViewBag.JavaScriptFunction = string.Format("FiltraPeticiones();");
            return View(await dbAccionesContext.ToListAsync());
        }

        // GET: Peticiones/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var peticione = await _context.Peticiones
                //.Include(p => p.Asociacion)
                //.Include(p => p.Dependecia)
                .Include(p => p.Diputado)
                .Include(p => p.EstatusNavigation)
                .Include(p => p.Legislatura)
                .Include(p => p.OrigenPeticion)
                .FirstOrDefaultAsync(m => m.PeticionId == id);
            if (peticione == null)
            {
                return NotFound();
            }

            return View(peticione);
        }

        // GET: Peticiones/Create
        public IActionResult Create()
        {
            int DiputadoId = 8;
            //ViewData["AsociacionId"] = new SelectList(_context.Asociaciones, "AsociacionID", "Nombre");
            ViewData["DependeciaId"] = new SelectList(_context.Dependencias, "DependenciaId", "DependenciaId");
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId");
            ViewData["Estatus"] = new SelectList(_context.EstatusPeticiones, "EstatusPeticionesId", "Nombre");

            //List<SelectListItem> asociacion = new SelectList(_context.Asociaciones, "AsociacionId", "Nombre").ToList();
            //var selected = asociacion.Where(x => x.Value == "").First();
            //selected.Selected = true;
            //ViewData["Asociaciones"] = asociacion;

            ViewData["Asociaciones"] = new SelectList(_context.Asociaciones, "AsociacionId", "Nombre");
            //ViewData["LegislaturaId"] = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre");

            var LegId = _context.Legislaturas.Where(l => l.Estatus == 1).Select(l => l.LegislaturaId).SingleOrDefault();
            List<SelectListItem> LLegis = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre").ToList();
            var selected = LLegis.Where(x => x.Value == LegId.ToString()).First();
            selected.Selected = true;
            ViewData["LegislaturaId"] = LLegis;

            ViewData["OrigenPeticionId"] = new SelectList(_context.OrigenPeticiones, "OrigenPeticionesId", "Nombre");

            List<SelectListItem> Lcat = new SelectList(_context.Usuarios.Where(u => u.Estatus == 1 && u.DiputadoId == DiputadoId && u.RolId == 3), "UsuarioId", "Nombre").ToList();

            Lcat.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["ResponsableAtenderId"] = Lcat;

            //ViewData["ResponsableAtenderId"] = new SelectList(_context.Usuarios.Where(u=>u.Estatus==1 && u.DiputadoId == DiputadoId && u.RolId==3), "UsuarioId", "Nombre");

            Peticione peticion = new Peticione();
            peticion.FechaSolicitud = DateTime.Now;
            return View();
        }

        // POST: Peticiones/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("PeticionId,LegislaturaId,DiputadoId,AsociacionId,FechaSolicitud,FechaCompromiso,FechaConclusion,Descripcion,Distrito,OrigenPeticionId,DependeciaId,Estatus,Hito,Campo1,Campo2,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] Peticione peticione)
        {
            if (ModelState.IsValid)
            {
                _context.Add(peticione);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            //ViewData["AsociacionId"] = new SelectList(_context.Asociaciones, "AsociacionId", "Nombre", peticione.AsociacionId);
            ViewData["DependeciaId"] = new SelectList(_context.Dependencias, "DependenciaId", "DependenciaId", peticione.DependeciaId);
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId", peticione.DiputadoId);
            ViewData["Estatus"] = new SelectList(_context.EstatusPeticiones, "EstatusPeticionesId", "Nombre", peticione.Estatus);

            List<SelectListItem> asociacion = new SelectList(_context.Asociaciones, "AsociacionId", "Nombre").ToList();
            var selected = asociacion.Where(x => x.Value == "").First();
            selected.Selected = true;
            ViewData["Asociaciones"] = asociacion;

            ViewData["LegislaturaId"] = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre", peticione.LegislaturaId);
            ViewData["OrigenPeticionId"] = new SelectList(_context.OrigenPeticiones, "OrigenPeticionesId", "Nombre", peticione.OrigenPeticionId);
            return View(peticione);
        }

        // GET: Peticiones/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            int DiputadoId = 8;
            if (id == null)
            {
                return NotFound();
            }

            var peticione = await _context.Peticiones.FindAsync(id);
            if (peticione == null)
            {
                return NotFound();
            }


            ViewData["Asociaciones"] = new SelectList(_context.Asociaciones, "AsociacionId", "Nombre", peticione.AsociacionId);
            ViewData["DependeciaId"] = new SelectList(_context.Dependencias, "DependenciaId", "DependenciaId", peticione.DependeciaId);
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId", peticione.DiputadoId);

            /* Muestra Lista de Estatus con el valor seleccionado */
            var valorEstatus = _context.Peticiones.Where(p => p.PeticionId == id).Select(p => p.Estatus).SingleOrDefault();
            List<SelectListItem> ListaEstatus = new SelectList(_context.EstatusPeticiones, "EstatusPeticionesId", "Nombre", peticione.Estatus).ToList();
            var selected = ListaEstatus.Where(x => x.Value == valorEstatus.ToString()).First();
            selected.Selected = true;
            ViewData["Estatus"] = ListaEstatus;

            /* Nombre del solicitante */
            ViewData["NomSolicitante"] = _context.Ciudadanos.Where(c => c.CiudadanoId == peticione.SolicitanteId).Select(c => c.Nombre + " " + c.Paterno + " " + c.Materno).FirstOrDefault();

            ViewData["LegislaturaId"] = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre", peticione.LegislaturaId);
            ViewData["OrigenPeticionId"] = new SelectList(_context.OrigenPeticiones, "OrigenPeticionesId", "Nombre", peticione.OrigenPeticionId);

            List<SelectListItem> Lresp = new SelectList(_context.Usuarios.Where(u => u.Estatus == 1 && u.DiputadoId == DiputadoId && u.RolId == 3), "UsuarioId", "Nombre").ToList();
            Lresp.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["ResponsableAtenderId"] = Lresp;

            ViewBag.JavaScriptFunction = string.Format("MuestraComplementoPeticion(" + id + ");");
            return View(peticione);
        }

        // POST: Peticiones/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("PeticionId,LegislaturaId,DiputadoId,AsociacionId,FechaSolicitud,FechaCompromiso,FechaConclusion,Descripcion,Distrito,OrigenPeticionId,DependeciaId,Estatus,Hito,Costo,Campo1,Campo2,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] Peticione peticione)
        {
            if (id != peticione.PeticionId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(peticione);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PeticioneExists(peticione.PeticionId))
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
            ViewData["Asociaciones"] = new SelectList(_context.Asociaciones, "AsociacionId", "Nombre", peticione.AsociacionId);
            ViewData["DependeciaId"] = new SelectList(_context.Dependencias, "DependenciaId", "DependenciaId", peticione.DependeciaId);
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId", peticione.DiputadoId);
            ViewData["Estatus"] = new SelectList(_context.EstatusPeticiones, "EstatusPeticionesId", "Nombre", peticione.Estatus);
            ViewData["LegislaturaId"] = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre", peticione.LegislaturaId);
            ViewData["OrigenPeticionId"] = new SelectList(_context.OrigenPeticiones, "OrigenPeticionesId", "Nombre", peticione.OrigenPeticionId);
            return View(peticione);
        }

        // GET: Peticiones/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var peticione = await _context.Peticiones
                //.Include(p => p.Asociacion)
                //.Include(p => p.Dependecia)
                .Include(p => p.Diputado)
                .Include(p => p.EstatusNavigation)
                .Include(p => p.Legislatura)
                .Include(p => p.OrigenPeticion)
                .FirstOrDefaultAsync(m => m.PeticionId == id);
            if (peticione == null)
            {
                return NotFound();
            }

            return View(peticione);
        }


        // POST: Gestiones/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            BORRA_PETICION(id);

            var peticione = await _context.Peticiones.FindAsync(id);
            _context.Peticiones.Remove(peticione);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool PeticioneExists(int id)
        {
            return _context.Peticiones.Any(e => e.PeticionId == id);
        }


        private bool GestionesExists(int id)
        {
            return _context.Gestiones.Any(e => e.GestionId == id);
        }

        /************************************************************
                    BORRAR Categoría y Subcategoría
        *************************************************************/
        [HttpPost]
        public int BorrarCategoriaSubCategoria(int peticionCategoriaId, int peticionSubcategoriaId)
        {
            var valReturn = 0;
            var peticionCategoriaIdAUX = 0;
            try
            {
                var peticionSubCategoria = _context.PeticionSubcategoria.Find(peticionSubcategoriaId);
                _context.PeticionSubcategoria.Remove(peticionSubCategoria);
                _context.SaveChanges();

                peticionCategoriaIdAUX = _context.PeticionSubcategoria.Where(psc => psc.PeticionCategoriaId == peticionCategoriaId).Count();

                if (peticionCategoriaIdAUX == 0)
                {
                    var peticionCategoria = _context.PeticionCategoria.Find(peticionCategoriaId);
                    _context.PeticionCategoria.Remove(peticionCategoria);
                    _context.SaveChanges();
                }

                valReturn = 1;
            }
            catch
            {
                valReturn = 0;
            }

            return valReturn;
        }

        /************************************************************
                    BORRAR Archivo de Petición
        *************************************************************/
        [HttpPost]
        public int BorrarArchivopeticion(int archivoId)
        {
            var valReturn = 0;
            try
            {
                var archivoPeticionObj = _context.ArchivosPeticiones.Find(archivoId);
                _context.ArchivosPeticiones.Remove(archivoPeticionObj);
                _context.SaveChanges();

                valReturn = 1;
            }
            catch
            {
                valReturn = 0;
            }

            return valReturn;
        }


        /************************************************************
                    BORRAR Beneficiario de Gestión
        *************************************************************/
        [HttpPost]
        public int BorrarBeneficiarioPeticion(int beneficiariosID)
        {
            var valReturn = 0;
            try
            {
                var beneficiarioObj = _context.Beneficiarios.Find(beneficiariosID);
                _context.Beneficiarios.Remove(beneficiarioObj);
                _context.SaveChanges();

                valReturn = 1;
            }
            catch
            {
                valReturn = 0;
            }

            return valReturn;
        }



        /************************************************************
                    BORRAR Archivo de Bitácora Petición
        *************************************************************/
        [HttpPost]
        public int BorrarArchivoBitacoraPeticion(int archivosBitacoraId)
        {
            var valReturn = 0;
            try
            {
                var archivoBitacoraPeticionObj = _context.ArchivosBitacoras.Find(archivosBitacoraId);
                _context.ArchivosBitacoras.Remove(archivoBitacoraPeticionObj);
                _context.SaveChanges();

                valReturn = 1;
            }
            catch
            {
                valReturn = 0;
            }

            return valReturn;
        }


        /************************************************************
                    BORRAR Actividad de Bitácora Petición
        *************************************************************/
        [HttpPost]
        public int BorrarActividadBitacoraPeticion(int bitacoraId)
        {
            var valReturn = 0;
            try
            {
                var archivoBitacoraPeticionObj = _context.ArchivosBitacoras.Where(ab => ab.BitacoraId == bitacoraId);
                foreach (ArchivosBitacora archB in archivoBitacoraPeticionObj)
                {
                    _context.ArchivosBitacoras.Remove(archB);
                    _context.SaveChanges();
                }

                var bitacoraObj = _context.Bitacoras.Find(bitacoraId);
                _context.Bitacoras.Remove(bitacoraObj);
                _context.SaveChanges();

                valReturn = 1;
            }
            catch
            {
                valReturn = 0;
            }

            return valReturn;
        }


        /****************************************************************************
             BORRA PETICIÓN
                 1. CATEGORIA
                 2. SUBCATEGORIA
                 3. ARCHIVOS
                 4. BENEFICIARIOS
                 5. ARCHIVOS DE SEGUIMIENTO
                 6. ACTIVIDADES DE SEGUIMIENTO
         *****************************************************************************/
        public int BORRA_PETICION(int idPeticion)
        {
            int rtn;
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpDELETE_Peticion";
            cmd.Parameters.Add("@PeticionID", System.Data.SqlDbType.Int).Value = idPeticion;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            try
            {
                var nrow = cmd.ExecuteNonQuery();
                rtn = Convert.ToInt32(cmd.Parameters["@ReturnValue"].Value);
                conn.Close();
                if (nrow > 0)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return 0;
            }
        }

        /************************************************************
            Nueva Petición
        *************************************************************/
        [HttpPost]
        public int NuevaPeticion(int origenSolicitud, string folio, string fechaSolicitud, string fechaCompromiso, string fechaConclusion, int estatus, int solicitanteId, int asociacionId, string descripcionSolicitud, int hito, string costo, int responsableId, int legislaturaId)
        {
            Peticione peticion = new Peticione();
            peticion.OrigenPeticionId = origenSolicitud;
            peticion.Folio = folio ?? "";
            peticion.FechaSolicitud = fechaSolicitud == null || fechaSolicitud == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaSolicitud + " 00:00:00");
            peticion.FechaCompromiso = fechaCompromiso == null || fechaCompromiso == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaCompromiso + " 00:00:00");
            peticion.FechaConclusion = fechaConclusion == null || fechaConclusion == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaConclusion + " 00:00:00");
            peticion.Estatus = estatus;
            peticion.SolicitanteId = solicitanteId;
            peticion.AsociacionId = asociacionId;
            peticion.Descripcion = descripcionSolicitud ?? "";
            peticion.Hito = hito;
            var ci = (CultureInfo)CultureInfo.CurrentCulture.Clone();
            ci.NumberFormat.NumberDecimalSeparator = ".";
            peticion.Costo = float.Parse(costo, ci);
            peticion.ResponsableID = responsableId;

            peticion.Campo1 = "";
            peticion.Campo2 = 0;


            peticion.LegislaturaId = legislaturaId;
            peticion.DiputadoId = 8;
            peticion.Distrito = "V";
            peticion.FechaRegistro = DateTime.Now;
            peticion.FechaUltimoCambio = DateTime.Now;
            peticion.UsuarioRegistro = 1;
            peticion.DependeciaId = 0;

            //peticion.Asociacion = new Asociacione();
            //peticion.Dependecia = new Dependencia();
            //peticion.Diputado = new Diputado();
            //peticion.EstatusNavigation = new EstatusPeticione();
            //peticion.Legislatura = new Legislatura();
            //peticion.OrigenPeticion = new OrigenPeticione();

            try
            {
                _context.Add(peticion);
                _context.SaveChanges();

                if (peticion.PeticionId != 0)
                {
                    return peticion.PeticionId;
                }
                else
                {
                    Console.WriteLine("No se insertó en la BD la petición");
                    return -1;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Insertar la petición: {0}", e.Message);
                return -2;
            }
        }


        /************************************************************
            Actualiza Petición
        *************************************************************/
        [HttpPost]
        public int ActualizaPeticion(int idPeticion, int origenSolicitud, string folio, string fechaSolicitud, string fechaCompromiso, string fechaConclusion, int estatus, int solicitanteId, int asociacionId, string descripcionSolicitud, int hito, string costo, int responsableId, int legislaturaId)
        {
            //Peticione peticion = new Peticione();
            var peticion = _context.Peticiones.Find(idPeticion);
            //peticion.PeticionId = idPeticion;
            peticion.OrigenPeticionId = origenSolicitud;
            peticion.Folio = folio ?? "";
            peticion.FechaSolicitud = Convert.ToDateTime(fechaSolicitud + " 00:00:00");
            peticion.FechaCompromiso = Convert.ToDateTime(fechaCompromiso + " 00:00:00");
            peticion.FechaConclusion = Convert.ToDateTime(fechaConclusion + " 00:00:00");
            peticion.Estatus = estatus;
            peticion.SolicitanteId = solicitanteId;
            peticion.AsociacionId = asociacionId;
            peticion.Descripcion = descripcionSolicitud ?? "";
            peticion.Hito = hito;
            var ci = (CultureInfo)CultureInfo.CurrentCulture.Clone();
            ci.NumberFormat.NumberDecimalSeparator = ".";
            peticion.Costo = float.Parse(costo, ci);
            peticion.ResponsableID = responsableId;

            peticion.Campo1 = "";
            peticion.Campo2 = 0;


            peticion.LegislaturaId = legislaturaId;
            peticion.DiputadoId = 8;
            peticion.Distrito = "V";
            //peticion.FechaRegistro = DateTime.Now;
            peticion.FechaUltimoCambio = DateTime.Now;
            peticion.UsuarioRegistro = 1;
            peticion.DependeciaId = 0;

            try
            {
                _context.Update(peticion);
                _context.SaveChanges();

                if (peticion.PeticionId != 0)
                {
                    return peticion.PeticionId;
                }
                else
                {
                    Console.WriteLine("No se insertó en la BD la petición");
                    return -1;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Insertar la petición: {0}", e.Message);
                return -1;
            }
        }

        /****************************************************************************
            Guarda categoría y SubCategoria de una Petición
        *****************************************************************************/
        public int GuardaCategoriaSubCategoriaBD(int idPeticion, int categoriaId, int subCategoriaId)
        {
            int rtn;
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpAgregaUnaCategoria_SubCategoria";
            cmd.Parameters.Add("@PeticionID", System.Data.SqlDbType.Int).Value = idPeticion;
            cmd.Parameters.Add("@CategoriaID", System.Data.SqlDbType.Int).Value = categoriaId;
            cmd.Parameters.Add("@SubCategoriaID", System.Data.SqlDbType.Int).Value = subCategoriaId;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 1;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            try
            {
                var nrow = cmd.ExecuteNonQuery();
                rtn = Convert.ToInt32(cmd.Parameters["@ReturnValue"].Value);
                conn.Close();
                if (nrow > 0)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return 0;
            }
        }


        /****************************************************************************
            Obtiene Categorías y Subcategorías de una Petición ID
        *****************************************************************************/
        [HttpGet]
        public List<ObjetoCategoriaSubCategoria> ObtieneListaCatSubCat(int idPeticion)
        {
            List<ObjetoCategoriaSubCategoria> ListaObjetos = new List<ObjetoCategoriaSubCategoria>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpObtieneCategoriasSubCategorias_De_Peticion";
            cmd.Parameters.Add("@PeticionID", System.Data.SqlDbType.Int).Value = idPeticion;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoCategoriaSubCategoria obj = new ObjetoCategoriaSubCategoria();
                    obj.PeticionCategoriaID = query.GetInt32(0);
                    obj.CategoriaID = query.GetInt32(1);
                    obj.DescripcionCat = query.GetString(2);
                    obj.PeticionSubcategoriaID = query.GetInt32(3);
                    obj.SubcategoriasID = query.GetInt32(4);
                    obj.DescripcionSubcat = query.GetString(5);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }



        /****************************************************************************
            Obtiene Lista de Archivos de una Petición ID
        *****************************************************************************/
        [HttpGet]
        public List<ObjetoArchivos> ObtieneListaArchivos(int idPeticion)
        {
            List<ObjetoArchivos> ListaObjetos = new List<ObjetoArchivos>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpObtieneArchivosDePeticion";
            cmd.Parameters.Add("@PeticionID", System.Data.SqlDbType.Int).Value = idPeticion;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoArchivos obj = new ObjetoArchivos();
                    obj.ArchivosPeticionesID = query.GetInt32(0);
                    obj.PeticionID = query.GetInt32(1);
                    obj.NombreArchivo = query.GetString(2);
                    obj.URL = query.GetString(3);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }


        /****************************************************************************
                    Subir Archivos Anexos a una Petición de apoyo
        *****************************************************************************/
        [Microsoft.AspNetCore.Mvc.HttpPost]
        [RequestSizeLimit(100_000_000)]
        public Microsoft.AspNetCore.Mvc.JsonResult SubirArchivoPeticion(List<IFormFile> files, int PeticionId)
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

                    nombreArchivoBD = TokenProvider.ComputeSha256Hash(Convert.ToString(PeticionId) + "_" + numeroArchivosXpeticionId(PeticionId)) + "." + extensionArchivo;

                    filePath = Path.Combine(@"C:\ARCHIVOS_APP\PETICIONES\APOYOS\", nombreArchivoBD);

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
                        var URL = "/Archivos/PETICIONES/APOYOS/" + nombreArchivoBD;

                        GuardaReferenciaArchivoPeticionBD(nombreArchivo, nombreArchivoBD, URL, PeticionId);

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
            Guarda Referencia de Archivos INICIATIVA en Base de Datos
        *****************************************************************************/
        public string GuardaReferenciaArchivoPeticionBD(string NombreArchivo, string NombreArchivoBD, string URL, int PeticionId)
        {
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpRegistraNuevoArchivoPeticiones";
            cmd.Parameters.Add("@NombreArchivoBD", System.Data.SqlDbType.VarChar, 150).Value = NombreArchivoBD;
            cmd.Parameters.Add("@NombreArchivo", System.Data.SqlDbType.VarChar, 200).Value = NombreArchivo;
            cmd.Parameters.Add("@URL", System.Data.SqlDbType.VarChar, 500).Value = URL;
            cmd.Parameters.Add("@PeticionId", System.Data.SqlDbType.Int).Value = PeticionId;
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
            Subir Archivos Anexos Petición - Bitacora
         *****************************************************************************/
        [Microsoft.AspNetCore.Mvc.HttpPost]
        [RequestSizeLimit(100_000_000)]
        public Microsoft.AspNetCore.Mvc.JsonResult SubirArchivoPeticionBitacora(List<IFormFile> files, int PeticionId, int BitacoraId)
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

                    nombreArchivoBD = TokenProvider.ComputeSha256Hash(Convert.ToString(BitacoraId) + "_" + numeroArchivosXbitacoraPeticionId(BitacoraId)) + "." + extensionArchivo;

                    filePath = Path.Combine(@"C:\ARCHIVOS_APP\PETICIONES\APOYO_SEGUIMIENTO\", nombreArchivoBD);

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
                        var URL = "/Archivos/PETICIONES/APOYO_SEGUIMIENTO/" + nombreArchivoBD;

                        GuardaReferenciaArchivoPeticionSeguimientoBD(nombreArchivo, nombreArchivoBD, URL, PeticionId, BitacoraId);

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
            Guarda Referencia de Archivos PETICIÓN en Base de Datos
        *****************************************************************************/
        public string GuardaReferenciaArchivoPeticionSeguimientoBD(string NombreArchivo, string NombreArchivoBD, string URL, int PeticionId, int BitacoraId)
        {
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpRegistraNuevoArchivoPeticionesBitacora";
            cmd.Parameters.Add("@NombreArchivoBD", System.Data.SqlDbType.VarChar, 150).Value = NombreArchivoBD;
            cmd.Parameters.Add("@NombreArchivo", System.Data.SqlDbType.VarChar, 200).Value = NombreArchivo;
            cmd.Parameters.Add("@URL", System.Data.SqlDbType.VarChar, 500).Value = URL;
            cmd.Parameters.Add("@PeticionId", System.Data.SqlDbType.Int).Value = PeticionId;
            cmd.Parameters.Add("@BitacoraPeticionId", System.Data.SqlDbType.Int).Value = BitacoraId;
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
            Guarda Nuevo Beneficiario de una Petición
        *****************************************************************************/
        [HttpPost]
        public int GuardaNuevoBeneficiario(int idPeticion, int beneficiarioId, string descripcionApoyo)
        {
            int personasCount = 0; 
            int rtn;
            descripcionApoyo = descripcionApoyo ?? "";

            personasCount = _context.Beneficiarios.Where(b => b.PeticionId == idPeticion && b.CiudadanoId == beneficiarioId).Count();

            if (personasCount != 0)
            {
                return 0;
            }

            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpAgregaBeneficiario_Notas";
            cmd.Parameters.Add("@PeticionID", System.Data.SqlDbType.Int).Value = idPeticion;
            cmd.Parameters.Add("@BeneficiarioID", System.Data.SqlDbType.Int).Value = beneficiarioId;
            cmd.Parameters.Add("@Nota", System.Data.SqlDbType.VarChar, 3000).Value = descripcionApoyo;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 1;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            try
            {
                var nrow = cmd.ExecuteNonQuery();
                rtn = Convert.ToInt32(cmd.Parameters["@ReturnValue"].Value);
                conn.Close();
                if (nrow > 0)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return 0;
            }
        }


        /****************************************************************************
            Actualiza descripción de apoyo a un Beneficiario
        *****************************************************************************/
        [HttpPost]
        public int ActualizaDescripcionApoyoBeneficiario(int idPeticion, int beneficiarioId, string descripcionApoyo)
        {
            int rtn;
            descripcionApoyo = descripcionApoyo ?? "";

            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpActualizaDescApoyoBeneficiario";
            cmd.Parameters.Add("@PeticionID", System.Data.SqlDbType.Int).Value = idPeticion;
            cmd.Parameters.Add("@BeneficiarioID", System.Data.SqlDbType.Int).Value = beneficiarioId;
            cmd.Parameters.Add("@Nota", System.Data.SqlDbType.VarChar, 3000).Value = descripcionApoyo;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 1;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            try
            {
                var nrow = cmd.ExecuteNonQuery();
                rtn = Convert.ToInt32(cmd.Parameters["@ReturnValue"].Value);
                conn.Close();
                if (nrow > 0)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return 0;
            }
        }

        /****************************************************************************
            Obtiene Lista de Beneficiarios de una Petición ID
        *****************************************************************************/
        [HttpGet]
        public List<ObjetoBeneficiarios> ObtieneListaBeneficiariosPeticionId(int idPeticion)
        {
            List<ObjetoBeneficiarios> ListaObjetos = new List<ObjetoBeneficiarios>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpObtieneBeneficiarios_De_Peticion";
            cmd.Parameters.Add("@PeticionID", System.Data.SqlDbType.Int).Value = idPeticion;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoBeneficiarios obj = new ObjetoBeneficiarios();
                    obj.CiudadanoID = query.GetInt32(0);
                    obj.PeticionID = query.GetInt32(1);
                    obj.Notas = query.GetString(2);
                    obj.Estatus = query.GetInt32(3);
                    obj.Latitud = query.GetString(4);
                    obj.Longitud = query.GetString(5);
                    obj.NombreCompleto = query.GetString(6);
                    obj.Colonia = query.GetString(7);
                    obj.Calle = query.GetString(8);
                    obj.BeneficiariosID = query.GetInt32(9);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }


        /****************************************************************************
            Obtiene Bitácora de una Petición ID
        *****************************************************************************/
        [HttpGet]
        public IEnumerable<ObjetoBitacora> ObtieneBitacoraPeticionId(int idPeticion)
        {
            IEnumerable<ObjetoBitacora> ListaObjetos = new List<ObjetoBitacora>();
            ListaObjetos = (IEnumerable<ObjetoBitacora>)(
                    from bitacora in _context.Bitacoras.Where(b => b.PeticionId == idPeticion)
                    select new ObjetoBitacora
                    {
                        BitacoraBase = new Bitacora
                        {
                            BitacoraId = bitacora.BitacoraId,
                            FechaRegistro = bitacora.FechaRegistro,
                            FechaCompromiso = bitacora.FechaCompromiso,
                            FechaConclusion = bitacora.FechaConclusion,
                            Estatus = bitacora.Estatus,
                            Descripcion = bitacora.Descripcion,
                            Responsable = bitacora.Responsable
                        },

                        ArchivosRelacionadosBitacora = (List<ArchivosBitacora>)(
                            from archivoBitacora in _context.ArchivosBitacoras.Where(ab => ab.BitacoraId == bitacora.BitacoraId)
                            select new ArchivosBitacora
                            {
                                ArchivosBitacoraId = archivoBitacora.ArchivosBitacoraId,
                                BitacoraId = archivoBitacora.BitacoraId,
                                NombreArchivo = archivoBitacora.NombreArchivo, 
                                Url = archivoBitacora.Url
                            }
                        )
                    });
            return ListaObjetos;
        }



        /****************************************************************************
            Guarda Nueva Actividad en Bitácora
        *****************************************************************************/
        [HttpPost]
        public int GuardaNuevaActividadBitacora(int idPeticion, string actividad, string fechaRegistro, string fechaCompromiso, string fechaConclusion, int estatusBitacora, string responsableBitacora)
        {
            int rtn;
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpAgregaActividadBitacora";
            cmd.Parameters.Add("@PeticionID", System.Data.SqlDbType.Int).Value = idPeticion;
            cmd.Parameters.Add("@Descripcion", System.Data.SqlDbType.VarChar, 3000).Value = actividad;


            cmd.Parameters.Add("@FechaRegistro", System.Data.SqlDbType.DateTime).Value = fechaRegistro == null || fechaRegistro == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaRegistro + " 00:00:00");
            cmd.Parameters.Add("@FechaCompromiso", System.Data.SqlDbType.DateTime).Value = fechaCompromiso == null || fechaCompromiso == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaCompromiso + " 00:00:00");
            cmd.Parameters.Add("@FechaConclusion", System.Data.SqlDbType.DateTime).Value = fechaConclusion == null || fechaConclusion == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaConclusion + " 00:00:00");

            cmd.Parameters.Add("@Estatus", System.Data.SqlDbType.Int).Value = estatusBitacora;
            cmd.Parameters.Add("@Responsable", System.Data.SqlDbType.VarChar, 200).Value = responsableBitacora == null ? "" : responsableBitacora;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 2;

            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            try
            {
                var nrow = cmd.ExecuteNonQuery();
                rtn = Convert.ToInt32(cmd.Parameters["@ReturnValue"].Value);
                conn.Close();
                if (nrow > 0)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return 0;
            }
        }

        /****************************************************************************
             ACTUALIZA Actividad en Bitácora
         *****************************************************************************/
        [HttpPost]
        public int ActualizaActividadBitacora(int bitacoraId, int idPeticion, string actividad, string fechaRegistro, string fechaCompromiso, string fechaConclusion, int estatusBitacora, string responsableBitacora)
        {
            int rtn;
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpACTUALIZAactividadBitacora";
            cmd.Parameters.Add("@PeticionID", System.Data.SqlDbType.Int).Value = idPeticion;
            cmd.Parameters.Add("@BitacoraID", System.Data.SqlDbType.Int).Value = bitacoraId;
            cmd.Parameters.Add("@Descripcion", System.Data.SqlDbType.VarChar, 3000).Value = actividad;


            cmd.Parameters.Add("@FechaRegistro", System.Data.SqlDbType.DateTime).Value = fechaRegistro == null || fechaRegistro == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaRegistro + " 00:00:00");
            cmd.Parameters.Add("@FechaCompromiso", System.Data.SqlDbType.DateTime).Value = fechaCompromiso == null || fechaCompromiso == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaCompromiso + " 00:00:00");
            cmd.Parameters.Add("@FechaConclusion", System.Data.SqlDbType.DateTime).Value = fechaConclusion == null || fechaConclusion == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaConclusion + " 00:00:00");

            cmd.Parameters.Add("@Estatus", System.Data.SqlDbType.Int).Value = estatusBitacora;
            cmd.Parameters.Add("@Responsable", System.Data.SqlDbType.VarChar, 200).Value = responsableBitacora == null ? "" : responsableBitacora;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 2;

            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            try
            {
                var nrow = cmd.ExecuteNonQuery();
                rtn = Convert.ToInt32(cmd.Parameters["@ReturnValue"].Value);
                conn.Close();
                if (nrow > 0)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return 0;
            }
        }
         

        /*******************************************************************
            Obtiene el número de Archivos Peticion ID 
        ********************************************************************/
        public Int32 numeroArchivosXpeticionId(int idDocumento)
        {
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[ArchivosPeticiones] WHERE PeticionID = " + idDocumento;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }

        /*******************************************************************
            Obtiene el número de Archivos BITACORA Petición ID 
        ********************************************************************/
        public Int32 numeroArchivosXbitacoraPeticionId(int idDocumento)
        {
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[ArchivosBitacora] WHERE BitacoraID = " + idDocumento;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }



        /*******************************************************************************
            Obtiene Todas las SOLICITUDES DE PETICIONES con Argumentos para WHERE
        ********************************************************************************/
        public IEnumerable<ObjetoPeticiones> ObtienePeticiones(int RegXpag, int offsetPeticiones, int LegislaturaID, int origenPeticion, string folio, int hito, string nombreSolicitante, string descripcion, int categoriaId, int subCategoriaId, int estatusId, string fechaInicioSolicitud, string fechaFinSolicitud, string fechaInicioConclusion, string fechaFinConclusion, int asociacionId, int dependenciaId, int responsableId)
        {
            int diputadoId = 8;
            IEnumerable<ObjetoPeticiones> ListaObjetos = new List<ObjetoPeticiones>();
            ListaObjetos = (IEnumerable<ObjetoPeticiones>)(
                    from peticiones in _context.Peticiones.Where(pet => pet.LegislaturaId == LegislaturaID && pet.DiputadoId == diputadoId)
                    join origenPeticiones in _context.OrigenPeticiones on peticiones.OrigenPeticionId equals origenPeticiones.OrigenPeticionesId
                    join ciudadanos in _context.Ciudadanos on peticiones.SolicitanteId equals ciudadanos.CiudadanoId
                    join estatusPeticiones in _context.EstatusPeticiones on peticiones.Estatus equals estatusPeticiones.EstatusPeticionesId
                    join legislatura in _context.Legislaturas on peticiones.LegislaturaId equals legislatura.LegislaturaId

                    //where true && String.IsNullOrEmpty(folio) ? (true) : peticiones.Folio.Contains(folio)
                    where true && String.IsNullOrEmpty(nombreSolicitante) ? (true) : ciudadanos.NombreCompleto.Contains(nombreSolicitante)
                    where true && String.IsNullOrEmpty(descripcion) ? (true) : peticiones.Descripcion.Contains(descripcion)
                    where true && String.IsNullOrEmpty(folio) ? (true) : peticiones.Folio.Contains(folio)
                    where true && (responsableId < 0) ? (true) : peticiones.ResponsableID == responsableId
                    where true && (origenPeticion <= 1) ? (true) : peticiones.OrigenPeticionId == origenPeticion
                    where true && (estatusId <= 1) ? (true) : peticiones.Estatus == estatusId
                    where true && (asociacionId <= 0) ? (true) : peticiones.AsociacionId == asociacionId
                    where true && (dependenciaId <= 0) ? (true) : peticiones.DependeciaId == dependenciaId
                    where true && (hito < 0) ? (true) : peticiones.Hito == hito
                    where true && (fechaInicioSolicitud == "0" && fechaFinSolicitud == "0") ? (true) : _context.Peticiones.Where(p => p.FechaRegistro >= DateTime.ParseExact(fechaInicioSolicitud, "dd-MM-yyyy HH:mm", null) && p.FechaSolicitud <= DateTime.ParseExact(fechaFinSolicitud, "dd-MM-yyyy HH:mm", null)).Select(p => p.PeticionId).Contains(peticiones.PeticionId)
                    where true && (categoriaId == 0) ? (true) : _context.PeticionCategoria.Where(pc => pc.PeticionId == peticiones.PeticionId && pc.CategoriaId == categoriaId).Select(pc => pc.PeticionId).Contains(peticiones.PeticionId)
                    where true && (subCategoriaId == 0) ? (true) : _context.PeticionSubcategoria.Where(psc => psc.PeticionId == peticiones.PeticionId && psc.SubcategoriaId == subCategoriaId).Select(psc => psc.PeticionId).Contains(peticiones.PeticionId)

                    //orderby Convert.ToInt32(peticiones.Folio) descending
                    orderby peticiones.FechaRegistro descending

                    select new ObjetoPeticiones
                    {
                        PeticionId = peticiones.PeticionId,
                        LegislaturaId = (int)peticiones.LegislaturaId,
                        LegislaturaNombre = legislatura.Nombre,
                        NumFolio = peticiones.Folio,
                        OrigenPeticionId = (int)peticiones.OrigenPeticionId,
                        OrigenPeticion = origenPeticiones.Nombre,
                        NombreCompleto = ciudadanos.Nombre + " " + ciudadanos.Paterno + " " + ciudadanos.Materno, //ciudadanos.NombreCompleto,
                        Paterno = ciudadanos.Paterno,
                        Materno = ciudadanos.Materno,
                        Nombre = ciudadanos.Nombre,
                        Descripcion = peticiones.Descripcion,
                        EstatusId = (int)peticiones.Estatus,
                        diasTranscurridos = (int)(DateTime.Now - (DateTime)peticiones.FechaSolicitud).Days,
                        diasSolucion = (int)(peticiones.FechaConclusion != DateTime.Parse("1900-01-01 00:00:00.000") ? ((DateTime)peticiones.FechaConclusion - (DateTime)peticiones.FechaSolicitud).Days : -1),
                        Estatus = estatusPeticiones.Nombre,
                        FechaRegistro = peticiones.FechaRegistro != null ? ((DateTime)peticiones.FechaRegistro).ToShortDateString() : "",
                        Costo = (float)peticiones.Costo,
                        FechaSolicitud = peticiones.FechaSolicitud != null ? ((DateTime)peticiones.FechaSolicitud).ToShortDateString() : "",
                        detalleCategoriaSubcategoria = (List<DetalleCategoriaSubcategoria>)(
                            from peticionesCategoria in _context.PeticionCategoria.Where(petC => petC.PeticionId == peticiones.PeticionId)
                            join peticionesSubcategoria in _context.PeticionSubcategoria on peticionesCategoria.PeticionCategoriaId equals peticionesSubcategoria.PeticionCategoriaId
                            join categoria in _context.Categorias on peticionesCategoria.CategoriaId equals categoria.CategoriaId
                            join subcategoria in _context.Subcategorias on peticionesSubcategoria.SubcategoriaId equals subcategoria.SubcategoriasId
                            select new DetalleCategoriaSubcategoria
                            {
                                PeticionId = (int)peticionesCategoria.PeticionId,
                                CategoriaId = (int)peticionesCategoria.CategoriaId,
                                Categoria = categoria.Descripcion,
                                SubcategoriaId = (int)peticionesSubcategoria.SubcategoriaId,
                                Subcategoria = subcategoria.Descripcion
                            }
                        )
                    }).Skip(offsetPeticiones).Take(RegXpag);
            return ListaObjetos;
        }

        /************************************************************
            Obtiene Número de Registros aplicando FILTRO
        *************************************************************/
        public int ObtieneNumeroPeticionesXfiltro(int LegislaturaID, int origenPeticion, string folio, int hito, string nombreSolicitante, string descripcion, int categoriaId, int subCategoriaId, int estatusId, string fechaInicioSolicitud, string fechaFinSolicitud, string fechaInicioConclusion, string fechaFinConclusion, int asociacionId, int dependenciaId, int responsableId)
        {
            int diputadoId = 8;
            var results =
                    from peticiones in _context.Peticiones.Where(pet => pet.LegislaturaId == LegislaturaID && pet.DiputadoId == diputadoId)
                    join origenPeticiones in _context.OrigenPeticiones on peticiones.OrigenPeticionId equals origenPeticiones.OrigenPeticionesId
                    join ciudadanos in _context.Ciudadanos on peticiones.SolicitanteId equals ciudadanos.CiudadanoId
                    join estatusPeticiones in _context.EstatusPeticiones on peticiones.Estatus equals estatusPeticiones.EstatusPeticionesId
                    join legislatura in _context.Legislaturas on peticiones.LegislaturaId equals legislatura.LegislaturaId

                    //where true && String.IsNullOrEmpty(folio) ? (true) : peticiones.Folio.Contains(folio)
                    where true && String.IsNullOrEmpty(nombreSolicitante) ? (true) : ciudadanos.NombreCompleto.Contains(nombreSolicitante)
                    where true && String.IsNullOrEmpty(descripcion) ? (true) : peticiones.Descripcion.Contains(descripcion)
                    where true && String.IsNullOrEmpty(folio) ? (true) : peticiones.Folio.Contains(folio)
                    where true && (responsableId < 0) ? (true) : peticiones.ResponsableID == responsableId
                    where true && (origenPeticion <= 1) ? (true) : peticiones.OrigenPeticionId == origenPeticion
                    where true && (estatusId <= 1) ? (true) : peticiones.Estatus == estatusId
                    where true && (asociacionId <= 0) ? (true) : peticiones.AsociacionId == asociacionId
                    where true && (dependenciaId <= 0) ? (true) : peticiones.DependeciaId == dependenciaId
                    where true && (hito < 0) ? (true) : peticiones.Hito == hito
                    where true && (fechaInicioSolicitud == "0" && fechaFinSolicitud == "0") ? (true) : _context.Peticiones.Where(p => p.FechaRegistro >= DateTime.ParseExact(fechaInicioSolicitud, "dd-MM-yyyy HH:mm", null) && p.FechaSolicitud <= DateTime.ParseExact(fechaFinSolicitud, "dd-MM-yyyy HH:mm", null)).Select(p => p.PeticionId).Contains(peticiones.PeticionId)
                    where true && (categoriaId == 0) ? (true) : _context.PeticionCategoria.Where(pc => pc.PeticionId == peticiones.PeticionId && pc.CategoriaId == categoriaId).Select(pc => pc.PeticionId).Contains(peticiones.PeticionId)
                    where true && (subCategoriaId == 0) ? (true) : _context.PeticionSubcategoria.Where(psc => psc.PeticionId == peticiones.PeticionId && psc.SubcategoriaId == subCategoriaId).Select(psc => psc.PeticionId).Contains(peticiones.PeticionId)

                    //orderby Convert.ToInt32(peticiones.Folio) descending

                    select peticiones.PeticionId;

            return results.Count();
        }


        /************************************************************
            Obtiene Una Iniciativa identificada por un Id
        *************************************************************/
        public IEnumerable<ObjetoPeticion> ObtieneDetallePeticion(int PeticionId)
        {
            IEnumerable<ObjetoPeticion> ListaObjetos = new List<ObjetoPeticion>();
            ListaObjetos = (IEnumerable<ObjetoPeticion>)(
                    from peticiones in _context.Peticiones.Where(pet => pet.PeticionId == PeticionId)
                    //join asociaciones in _context.Asociaciones on peticiones.AsociacionId equals asociaciones.AsociacionId
                    join origenPeticiones in _context.OrigenPeticiones on peticiones.OrigenPeticionId equals origenPeticiones.OrigenPeticionesId
                    //join dependencias in _context.Dependencias on peticiones.DependeciaId equals dependencias.DependenciaId
                    join estatus in _context.EstatusPeticiones on peticiones.Estatus equals estatus.EstatusPeticionesId
                    join ciudadanos in _context.Ciudadanos on peticiones.SolicitanteId equals ciudadanos.CiudadanoId
                    join usuario in _context.Usuarios.Where(u => u.Estatus==1) on peticiones.ResponsableID equals usuario.UsuarioId into usrSel from usuario in usrSel.DefaultIfEmpty()

                    select new ObjetoPeticion
                    {
                        PeticionId = peticiones.PeticionId,
                        AsociacionId = (int)peticiones.AsociacionId,
                        //AsociacionNombre = asociaciones.Nombre??"",
                        AsociacionNombre = _context.Asociaciones.Where(a=>a.AsociacionId==peticiones.AsociacionId).Select(a=>a.Nombre).FirstOrDefault(),
                        Folio = peticiones.Folio,
                        FechaSolicitud = peticiones.FechaSolicitud,
                        FechaCompromiso = peticiones.FechaCompromiso,
                        FechaConclusion = peticiones.FechaConclusion,
                        Descripcion = peticiones.Descripcion,
                        OrigenPeticionId = peticiones.OrigenPeticionId,
                        OrigenPeticionNombre = origenPeticiones.Nombre,
                        DependeciaId = peticiones.DependeciaId,
                        //DependenciaNombre = dependencias.NombreDependecia??"",
                        DependenciaNombre = _context.Dependencias.Where(d=>d.DependenciaId==peticiones.DependeciaId).Select(d=>d.NombreDependecia).FirstOrDefault(),
                        Estatus = peticiones.Estatus,
                        EstatusDescripcion = estatus.Nombre,
                        Hito = peticiones.Hito,
                        Costo = peticiones.Costo,
                        // NombreResponsable = _context.Usuarios.Where(u => u.Estatus == 1 && u.UsuarioId == peticiones.ResponsableID).Select(u => u.Nombre).FirstOrDefault().ToString()??"",
                        NombreResponsable = usuario.Nombre + " " + usuario.Paterno + " " + usuario.Materno,
                        SolicitanteId = peticiones.SolicitanteId,
                        SolicitanteNombre = ciudadanos.NombreCompleto
                    });
            return ListaObjetos;
        }


        /*******************************************************************************
            Obtiene Todas las SOLICITUDES DE PETICIONES con Argumentos para WHERE
        ********************************************************************************/
        public IEnumerable<ObjetoPeticiones> ObtienePeticionesXciudadano(int LegislaturaID, int idCiudadano)
        {
            int diputadoId = 8;
            IEnumerable<ObjetoPeticiones> ListaObjetos = new List<ObjetoPeticiones>();
            ListaObjetos = (IEnumerable<ObjetoPeticiones>)(
                    from peticiones in _context.Peticiones.Where(pet => pet.LegislaturaId == LegislaturaID && pet.DiputadoId == diputadoId && pet.SolicitanteId == idCiudadano)
                    join origenPeticiones in _context.OrigenPeticiones on peticiones.OrigenPeticionId equals origenPeticiones.OrigenPeticionesId
                    join ciudadanos in _context.Ciudadanos on peticiones.SolicitanteId equals ciudadanos.CiudadanoId
                    join estatusPeticiones in _context.EstatusPeticiones on peticiones.Estatus equals estatusPeticiones.EstatusPeticionesId
                    join legislatura in _context.Legislaturas on peticiones.LegislaturaId equals legislatura.LegislaturaId

                    orderby peticiones.FechaRegistro descending

                    select new ObjetoPeticiones
                    {
                        PeticionId = peticiones.PeticionId,
                        LegislaturaId = (int)peticiones.LegislaturaId,
                        LegislaturaNombre = legislatura.Nombre,
                        NumFolio = peticiones.Folio,
                        OrigenPeticionId = (int)peticiones.OrigenPeticionId,
                        OrigenPeticion = origenPeticiones.Nombre,
                        NombreCompleto = ciudadanos.NombreCompleto,
                        Paterno = ciudadanos.Paterno,
                        Materno = ciudadanos.Materno,
                        Nombre = ciudadanos.Nombre,
                        Descripcion = peticiones.Descripcion,
                        EstatusId = (int)peticiones.Estatus,
                        diasTranscurridos = (int)(DateTime.Now - (DateTime)peticiones.FechaSolicitud).Days,
                        diasSolucion = (int)(peticiones.FechaConclusion != DateTime.Parse("1900-01-01 00:00:00.000") ? ((DateTime)peticiones.FechaConclusion - (DateTime)peticiones.FechaSolicitud).Days : -1),
                        Estatus = estatusPeticiones.Nombre,
                        FechaRegistro = peticiones.FechaRegistro != null ? ((DateTime)peticiones.FechaRegistro).ToShortDateString() : "",
                        Costo = (float)peticiones.Costo,
                        FechaSolicitud = peticiones.FechaSolicitud != null ? ((DateTime)peticiones.FechaSolicitud).ToShortDateString() : "",
                        detalleCategoriaSubcategoria = (List<DetalleCategoriaSubcategoria>)(
                            from peticionesCategoria in _context.PeticionCategoria.Where(petC => petC.PeticionId == peticiones.PeticionId)
                            join peticionesSubcategoria in _context.PeticionSubcategoria on peticionesCategoria.PeticionCategoriaId equals peticionesSubcategoria.PeticionCategoriaId
                            join categoria in _context.Categorias on peticionesCategoria.CategoriaId equals categoria.CategoriaId
                            join subcategoria in _context.Subcategorias on peticionesSubcategoria.SubcategoriaId equals subcategoria.SubcategoriasId
                            select new DetalleCategoriaSubcategoria
                            {
                                PeticionId = (int)peticionesCategoria.PeticionId,
                                CategoriaId = (int)peticionesCategoria.CategoriaId,
                                Categoria = categoria.Descripcion,
                                SubcategoriaId = (int)peticionesSubcategoria.SubcategoriaId,
                                Subcategoria = subcategoria.Descripcion
                            }
                        )
                    });
            return ListaObjetos;
        }
        /************************************************************
            createWhereAnioMes
        *************************************************************/
        private string createWhereAnioMes(int anioSel, int mesSel)
        {
            if (anioSel != 0 && mesSel == 0)
            {
                return "YEAR(FechaSolicitud) = " + anioSel;
            }
            else if (anioSel != 0 && mesSel != 0)
            {
                return "YEAR(FechaSolicitud) = " + anioSel + " AND MONTH(FechaSolicitud) = " + mesSel;
            }
            else
            {
                return "";
            }
        }

        /************************************************************
            createWhereAnioMes_2
        *************************************************************/
        private string createWhereAnioMes_2(int anioSel, int mesSel)
        {
            if (anioSel != 0 && mesSel == 0)
            {
                return "YEAR(Fecha) = " + anioSel;
            }
            else if (anioSel != 0 && mesSel != 0)
            {
                return "YEAR(Fecha) = " + anioSel + " AND MONTH(Fecha) = " + mesSel;
            }
            else
            {
                return "";
            }
        }

        /************************************************************
            createWhereAnioMes_3
        *************************************************************/
        private string createWhereAnioMes_3(int anioSel, int mesSel)
        {
            if (anioSel != 0 && mesSel == 0)
            {
                return "YEAR(FechaRegistro) = " + anioSel;
            }
            else if (anioSel != 0 && mesSel != 0)
            {
                return "YEAR(FechaRegistro) = " + anioSel + " AND MONTH(FechaRegistro) = " + mesSel;
            }
            else
            {
                return "";
            }
        }

        /************************************************************
            createWhereAnioMes
        *************************************************************/
        private string createWhereAnioMes_4(int anioSel, int mesSel)
        {
            if (anioSel != 0 && mesSel == 0)
            {
                return " YEAR(P.FechaSolicitud) = " + anioSel;
            }
            else if (anioSel != 0 && mesSel != 0)
            {
                return " YEAR(P.FechaSolicitud) = " + anioSel + " AND MONTH(P.FechaSolicitud) = " + mesSel;
            }
            else
            {
                return "";
            }
        }

        /*******************************************************************
            Obtiene el número de Peticiones
        ********************************************************************/
        public Int32 numeroPeticiones(int LegislaturaId, int anioSel, int mesSel)
        {
            int diputadoId = 8;
            string stm = "";
            var complemento = "";
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            complemento = createWhereAnioMes(anioSel, mesSel);
            if (complemento != "")
            {
                stm = "SELECT Count(*) FROM [dbo].[Peticiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + " AND " + complemento;
            }
            else
            {
                stm = "SELECT Count(*) FROM [dbo].[Peticiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId;
            }

            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }


        /*******************************************************************
            Obtiene el número de BeneficiariosPeticiones
        ********************************************************************/
        public Int32 numeroBeneficiariosPeticiones(int LegislaturaId, int anioSel, int mesSel)
        {
            int diputadoId = 8;
            string stm = "";
            var complemento = "";
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            complemento = createWhereAnioMes(anioSel, mesSel);
            if (complemento != "")
            {
                stm = "SELECT Count(*) FROM Beneficiarios WHERE PeticionID IN (SELECT PeticionID FROM [dbo].[Peticiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + " AND " + complemento +")";
            }
            else
            {
                stm = "SELECT Count(*) FROM Beneficiarios WHERE PeticionID IN (SELECT PeticionID FROM [dbo].[Peticiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + ")";
            }

            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }

        /*******************************************************************
            Obtiene el número de Peticiones X Año X Mes
        ********************************************************************/
        public Int32 numeroPeticionesXrango(int LegislaturaId)
        {
            int diputadoId = 8;
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[Peticiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }

        /*******************************************************************
            Obtiene el número de Peticiones Hitos
        ********************************************************************/
        public Int32 numeroPeticionesHitos(int LegislaturaId, int anioSel, int mesSel)
        {
            int diputadoId = 8;
            string stm = "";
            var complemento = "";
            complemento = createWhereAnioMes(anioSel, mesSel);
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            if (complemento != "")
            {
                stm = "SELECT Count(*) FROM [dbo].[Peticiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + " AND Hito=1" + " AND " + complemento;
            }
            else
            {
                stm = "SELECT Count(*) FROM [dbo].[Peticiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + " AND Hito=1";
            }
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count;
        }

        /*******************************************************************
            Obtiene el número de Eventos
        ********************************************************************/
        public Int32 numeroEventosResumen(int LegislaturaId, int anioSel, int mesSel)
        {
            int diputadoId = 8;
            string stm = "";
            var complemento = "";
            complemento = createWhereAnioMes_2(anioSel, mesSel);
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();

            if (complemento != "")
            {
                stm = "SELECT Count(*) FROM [dbo].[Eventos] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + " AND " + complemento;
            }
            else
            {
                stm = "SELECT Count(*) FROM [dbo].[Eventos] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId;
            }
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count;
        }


        /*******************************************************************
            Obtiene el número de Asociaciones
        ********************************************************************/
        public Int32 numeroAsociacionesResumen(int LegislaturaId, int anioSel, int mesSel)
        {
            int diputadoId = 8;
            string stm = "";
            var complemento = "";
            complemento = createWhereAnioMes_3(anioSel, mesSel);
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            
            
            if (complemento != "")
            {
                stm = "SELECT Count(*) FROM [dbo].[Asociaciones] WHERE Estatus=1 AND DiputadoID = " + diputadoId + " AND " + complemento;
            }
            else
            {
                stm = "SELECT Count(*) FROM [dbo].[Asociaciones] WHERE Estatus=1 AND DiputadoID = " + diputadoId;
            }
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count;
        }

        /*******************************************************************
            Obtiene el número de Eventos
        ********************************************************************/
        public Int32 numeroEventos(int LegislaturaId)
        {
            int diputadoId = 8;
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[Eventos] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count;
        }

        /*******************************************************************
            Obtiene el número de Visitas
        ********************************************************************/
        public Int32 numeroVisitas(int LegislaturaId)
        {
            int diputadoId = 8;
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[Visitas] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count;
        }

        /*******************************************************************
            Obtiene el número de Ciudadanos
        ********************************************************************/
        public Int32 numeroCiudadanos(int LegislaturaId, int anioSel, int mesSel)
        {
            int diputadoId = 8;
            string stm = "";
            var complemento = "";
            complemento = createWhereAnioMes_3(anioSel, mesSel);
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();

            if (complemento != "")
            {
                stm = "SELECT Count(*) FROM [dbo].[Ciudadanos] WHERE DiputadoID = " + diputadoId + " AND " + complemento;
            }
            else
            {
                stm = "SELECT Count(*) FROM [dbo].[Ciudadanos] WHERE DiputadoID = " + diputadoId;
            }
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count;
        }


        /*******************************************************************
                PETICIONES Obtiene Costo X Categoría
        ********************************************************************/
        public IEnumerable<ObjetoCostoPeticion> ObtenCostoPeticionXCategoria(int LegislaturaID, int anioSel, int mesSel)
        {
            int diputadoId = 8;
            string stm = "";
            var complemento = "";
            complemento = createWhereAnioMes_4(anioSel, mesSel);
            List<ObjetoCostoPeticion> ListaObjetos = new List<ObjetoCostoPeticion>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();

            conn.Open();

            if (complemento != "")
            {

                stm = "SELECT ISNULL(C.CategoriaID, 0) AS CategoriaID, ISNULL(C.Descripcion, '') AS Categoria, ISNULL(SUM(P.Costo),0) AS Costo";
                stm += "  FROM Peticiones AS P ";
                stm += "  LEFT JOIN PeticionCategoria AS PC ON PC.PeticionID = P.PeticionID ";
                stm += "  LEFT JOIN Categorias AS C ON C.CategoriaID = PC.CategoriaID ";
                stm += "  WHERE P.LegislaturaID = " + LegislaturaID + " AND P.DiputadoID = " + diputadoId + " AND " + complemento;
                stm += "  GROUP BY C.CategoriaID, C.Descripcion ";
            }
            else
            {
                stm = "SELECT ISNULL(C.CategoriaID, 0) AS CategoriaID, ISNULL(C.Descripcion, '') AS Categoria, ISNULL(SUM(P.Costo),0) AS Costo";
                stm += "  FROM Peticiones AS P ";
                stm += "  LEFT JOIN PeticionCategoria AS PC ON PC.PeticionID = P.PeticionID ";
                stm += "  LEFT JOIN Categorias AS C ON C.CategoriaID = PC.CategoriaID ";
                stm += "  WHERE P.LegislaturaID = " + LegislaturaID + " AND P.DiputadoID = " + diputadoId;
                stm += "  GROUP BY C.CategoriaID, C.Descripcion ";
            }

            SqlCommand cmd_p = new SqlCommand(stm, conn);

            SqlDataReader query = cmd_p.ExecuteReader();
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoCostoPeticion obj = new ObjetoCostoPeticion();
                    obj.CategoriaId = (int)query.GetInt32(0);
                    obj.Categoria = query.GetString(1);
                    obj.Costo = query.GetDouble(2).ToString();
                    ListaObjetos.Add(obj);
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }

        
        /*******************************************************************
            Obtiene Resumen de Peticiones X estatus
        ********************************************************************/
        public IEnumerable<ObjetoEstatusPeticiones> resumenXestatus(int LegislaturaId, int anioSel, int mesSel)
        {
            int diputadoId = 8;
            string stm = "";
            var complemento = "";
            complemento = createWhereAnioMes(anioSel, mesSel);
            List<ObjetoEstatusPeticiones> ListaObjetos = new List<ObjetoEstatusPeticiones>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            //SqlCommand cmd = conn.CreateCommand();

            conn.Open();


            if (complemento != "")
            {
                stm = "SELECT EP.Nombre, " +
                        "(SELECT Count(*) FROM [dbo].[peticiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + " AND Estatus = EP.EstatusPeticionesID " + " AND " + complemento + ") " +
                        " FROM EstatusPeticiones AS EP";
            }
            else
            {
                stm = "SELECT EP.Nombre, " +
                        "(SELECT Count(*) FROM [dbo].[peticiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + " AND Estatus = EP.EstatusPeticionesID)" +
                        " FROM EstatusPeticiones AS EP";
            }

            SqlCommand cmd_p = new SqlCommand(stm, conn);

            SqlDataReader query = cmd_p.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoEstatusPeticiones obj = new ObjetoEstatusPeticiones();
                    obj.estatus = query.GetString(0);
                    obj.cantidad = query.GetInt32(1);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }

        /*******************************************************************
            Obtiene Resumen de Peticiones X Clasificicación
        ********************************************************************/
        [HttpGet]
        public List<ObjetoClasificacionEstatusApoyo> resumenXclasificacion(int LegislaturaId, int anioSel, int mesSel)
        {
            List<ObjetoClasificacionEstatusApoyo> ListaObjetos = new List<ObjetoClasificacionEstatusApoyo>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpResumenPeticionXcategoriaXestatus";
            cmd.Parameters.Add("@LegislaturaId", System.Data.SqlDbType.Int).Value = LegislaturaId;
            cmd.Parameters.Add("@Anio", System.Data.SqlDbType.Int).Value = anioSel;
            cmd.Parameters.Add("@Mes", System.Data.SqlDbType.Int).Value = mesSel;
            //cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoClasificacionEstatusApoyo obj = new ObjetoClasificacionEstatusApoyo();
                    obj.Categoria = query.GetString(1);
                    obj.SinClasificacion = query.GetInt32(2);
                    obj.Solicitado = query.GetInt32(3);
                    obj.Cancelado = query.GetInt32(4);
                    obj.Entregado = query.GetInt32(5);
                    obj.Rechazado = query.GetInt32(6);
                    obj.Total = query.GetInt32(2) + query.GetInt32(3) + query.GetInt32(4) + query.GetInt32(5) + query.GetInt32(6);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }


        /****************************************************************************
            Obtiene Resumen de Peticiones X Clasificicación + Beneficiarios
        *****************************************************************************/
        [HttpGet]
        public List<ObjetoClasificacionEstatusApoyo> resumenXclasificacion_mas_beneficios(int LegislaturaId, int anioSel, int mesSel)
        {
            List<ObjetoClasificacionEstatusApoyo> ListaObjetos = new List<ObjetoClasificacionEstatusApoyo>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpApoyos_Beneficiarios";
            cmd.Parameters.Add("@LegislaturaId", System.Data.SqlDbType.Int).Value = LegislaturaId;
            cmd.Parameters.Add("@Anio", System.Data.SqlDbType.Int).Value = anioSel;
            cmd.Parameters.Add("@Mes", System.Data.SqlDbType.Int).Value = mesSel;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoClasificacionEstatusApoyo obj = new ObjetoClasificacionEstatusApoyo();
                    obj.Categoria = query.GetString(1)=="NULL"?"SIN CATEGORIA": query.GetString(1);
                    obj.SinClasificacion = query.GetInt32(2);
                    obj.Solicitado = query.GetInt32(3);
                    obj.Cancelado = query.GetInt32(4);
                    obj.Entregado = query.GetInt32(5);
                    obj.Rechazado = query.GetInt32(6);
                    obj.Total = query.GetInt32(2) + query.GetInt32(3) + query.GetInt32(4) + query.GetInt32(5) + query.GetInt32(6);
                    obj.Beneficiarios = query.GetInt32(7);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }
        /*******************************************************************
            Obtiene Resumen de Eventos X estatus
        ********************************************************************/
        public IEnumerable<ObjetoEstatusPeticiones> resumenXeventos(int LegislaturaId)
        {
            int diputadoId = 8;
            List<ObjetoEstatusPeticiones> ListaObjetos = new List<ObjetoEstatusPeticiones>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            //SqlCommand cmd = conn.CreateCommand();

            conn.Open();

            string stm = "SELECT EP.Nombre, " +
                        "(SELECT Count(*) FROM [dbo].[peticiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + " AND Estatus = EP.EstatusPeticionesID)" +
                        " FROM EstatusPeticiones AS EP";

            SqlCommand cmd_p = new SqlCommand(stm, conn);

            SqlDataReader query = cmd_p.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoEstatusPeticiones obj = new ObjetoEstatusPeticiones();
                    obj.estatus = query.GetString(0);
                    obj.cantidad = query.GetInt32(1);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }

        /************************************************************
            Busca si existe un Número de Folio
        *************************************************************/
        public int BuscaNumeroFolio(string folio, int legislaturaId)
        {
            var TotalRegistrosEncontrados = _context.Peticiones.Where(p => p.Folio == folio && p.LegislaturaId== legislaturaId).Count();
            return TotalRegistrosEncontrados;
        }

        /***********************************************************************************************
         *  Carga los valores del Combo de Subcategoria, dependiendo de la Categoría seleccionada
         ***********************************************************************************************/
        public JsonResult CargaValoresSubCategoria(int clasificacionId)
        {
            List<SelectListItem> resultado;

            resultado = _context.Subcategorias.Where(sc => sc.CategoriaId == clasificacionId).Select(sc => new SelectListItem
            {
                Value = sc.SubcategoriasId.ToString(),
                Text = sc.Descripcion
            }).ToList();
            resultado.Insert(0, new SelectListItem() { Value = "0", Text = "TODO" });
            return Json(resultado);
        }


        /******************************************************************************
         * Lee datos en una Tabla, para guardarlos en EXCEL
         ******************************************************************************/

        public DataTable ObtieneDatosReporteExcelList_DT()
        {
            int LegislaturaId = 2;
            int DiputaoId = 8;
            DataTable dt = new DataTable();
            dt.TableName = "Peticiones";

            dt.Columns.Add("Legislatura", typeof(string)); 
            dt.Columns.Add("Folio", typeof(string));
            dt.Columns.Add("Fecha Solicitud", typeof(DateTime));
            dt.Columns.Add("Paterno", typeof(string));
            dt.Columns.Add("Materno", typeof(string));
            dt.Columns.Add("Nombre", typeof(string));
            dt.Columns.Add("Descripción", typeof(string));
            dt.Columns.Add("Clasificación", typeof(string));
            dt.Columns.Add("Subclasificación", typeof(string));
            //dt.Columns.Add("Costo", typeof(string));
            dt.Columns.Add("Costo", typeof(decimal));
            dt.Columns.Add("Estatus", typeof(string));

            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpPeticiones_Excel";
            cmd.Parameters.Add("@LegislaturaID", System.Data.SqlDbType.Int).Value = LegislaturaId;
            cmd.Parameters.Add("@DiputadoID", System.Data.SqlDbType.Int).Value = DiputaoId;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    dt.Rows.Add(
                        query.GetString(0),         // Legislatura
                        query.GetString(1),         // Folio Petición
                        query.GetDateTime(2),       // Fecha Solicitud
                        query.GetString(3),         // Paterno
                        query.GetString(4),         // Materno
                        query.GetString(5),         // Nombre
                        query.GetString(6),         // Descripción
                        query.GetString(7),         // Clasificación
                        query.GetString(8),         // Subclasificación
                        //query.GetString(8),          // Costo
                        query.GetDecimal(9),          // Costo
                        query.GetString(10)          // Estatus
                    );
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return dt;
        }


        /***********************************************************************
         *  Excel
         ***********************************************************************/ 
        public ActionResult WriteDataToExcel()
        {
            DataTable dt = this.ObtieneDatosReporteExcelList_DT();
            string fileName = "Solicitudes.xlsx";
            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
                }
            }
        }

        /*******************************************************************
            Obtiene Avance X Semana
        ********************************************************************/
        [HttpGet]
        public List<ObjetoAvanceXsemana> SolicitudesAvanceXsemana(int LegislaturaId, int DiputadoId, int ResponsableId)
        {
            List<ObjetoAvanceXsemana> ListaObjetos = new List<ObjetoAvanceXsemana>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpCOMPORTAMIENTO";
            cmd.Parameters.Add("@LegislaturaId", System.Data.SqlDbType.Int).Value = LegislaturaId;
            cmd.Parameters.Add("@DiputadoId", System.Data.SqlDbType.Int).Value = DiputadoId;
            cmd.Parameters.Add("@ResponsableId", System.Data.SqlDbType.Int).Value = ResponsableId;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoAvanceXsemana obj = new ObjetoAvanceXsemana();
                    obj.Anio = query.GetInt32(0);
                    obj.Mes = query.GetString(1);
                    obj.NumeroSemana = query.GetInt32(2);
                    obj.RegistradaEnSemana = query.GetInt32(3);
                    obj.ConcluidaEnSemana = query.GetInt32(4);
                    obj.ProcesoAcumuladas = query.GetInt32(5);
                    obj.ConcluidasAcumulada = query.GetInt32(6);
                    obj.Total = query.GetInt32(7);
                    obj.FechaInicioSemana = query.GetDateTime(8);
                    obj.FechaFinSemana = query.GetDateTime(9);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }

        /*******************************************************************
            Obtiene Resumen de Apoyo X Clasificicación X Subclasificacion
        ********************************************************************/
        [HttpGet]
        public List<ObjetoClasificacionEstatusApoyo> resumenXclasificacionXSubclasificacion_Apoyo(int LegislaturaID, int anioSel, int mesSel)
        {
            List<ObjetoClasificacionEstatusApoyo> ListaObjetos = new List<ObjetoClasificacionEstatusApoyo>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpResumenPeticionXcategoriaXSubcategoriaXestatus";
            cmd.Parameters.Add("@LegislaturaId", System.Data.SqlDbType.Int).Value = LegislaturaID;
            cmd.Parameters.Add("@Anio", System.Data.SqlDbType.Int).Value = anioSel;
            cmd.Parameters.Add("@Mes", System.Data.SqlDbType.Int).Value = mesSel;
            //cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoClasificacionEstatusApoyo obj = new ObjetoClasificacionEstatusApoyo();
                    obj.CategoriaId = query.GetInt32(0);
                    obj.Categoria = query.GetString(1);
                    obj.SubcategoriaId = query.GetInt32(2);
                    obj.Subcategoria = query.GetString(3);
                    obj.SinClasificacion = query.GetInt32(4);
                    obj.Solicitado = query.GetInt32(5);
                    obj.Cancelado = query.GetInt32(6);
                    obj.Entregado = query.GetInt32(7);
                    obj.Rechazado = query.GetInt32(8);
                    obj.Total = query.GetInt32(4) + query.GetInt32(5) + query.GetInt32(6) + query.GetInt32(7) + query.GetInt32(8);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }



        /********************************************************************************************************
           Muestra los Beneficiarios por Categoria
         ********************************************************************************************************/
        public IActionResult Beneficiarios(int LegislaturaID, int anioSel, int mesSel)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            int DiputadoId = 8;
            if (LegislaturaID == 0)
            {
                var LegId = _context.Legislaturas.Where(l => l.Estatus == 1).Select(l => l.LegislaturaId).SingleOrDefault();
                List<SelectListItem> LLegis = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre").ToList();
                var selected = LLegis.Where(x => x.Value == LegId.ToString()).First();
                selected.Selected = true;
                ViewData["LegislaturaId"] = LLegis;
                LegislaturaID = LegId;
            }
            else
            {
                List<SelectListItem> LLegis = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre").ToList();
                var selected = LLegis.Where(x => x.Value == LegislaturaID.ToString()).First();
                selected.Selected = true;
                ViewData["LegislaturaId"] = LLegis;
            }

            IEnumerable<CategoriaBeneficiariosVM> BenCatLst = new List<CategoriaBeneficiariosVM>();

            BenCatLst = (IEnumerable<CategoriaBeneficiariosVM>)(
                                from categ in _context.Categorias.Where(c => c.Estatus != 0)

                                select new CategoriaBeneficiariosVM
                                {
                                    CategoriaId = categ.CategoriaId,
                                    Categoria = categ.Descripcion,
                                    // NumeroBenef = _context.Beneficiarios.Where(b=>b.Estatus!=0).Select(b=>b.PeticionId).Contains(_context.Peticiones.Where(p => p.LegislaturaId == LegislaturaID && p.DiputadoId == 8 && p.FechaSolicitud.Value.Year == anioSel && p.FechaSolicitud.Value.Month == mesSel).Select(p => (int)p.PeticionId)).Count(),
                                    //NumeroBenef = _context.Beneficiarios.Where(b => b.Estatus != 0).Select(b => b.PeticionId).Contains(_context.Peticiones.Where(p => p.LegislaturaId == LegislaturaID ).Select(p => (int)p.PeticionId)).Count(),
                                    BeneficiariosPeticiones = (IEnumerable<ObjetoBeneficiarioPeticion>)(
                                                from beneficiarios in _context.Beneficiarios.Where(b => b.Estatus == 1)
                                                join peticiones in _context.Peticiones on beneficiarios.PeticionId equals peticiones.PeticionId
                                                join petCategorias in _context.PeticionCategoria on peticiones.PeticionId equals petCategorias.PeticionId
                                                join categorias in _context.Categorias on petCategorias.CategoriaId equals categorias.CategoriaId
                                                join ciudadanos in _context.Ciudadanos on beneficiarios.CiudadanoId equals ciudadanos.CiudadanoId
                                                where categorias.CategoriaId == categ.CategoriaId && peticiones.LegislaturaId == LegislaturaID
                                                where anioSel == 0 ? true: peticiones.FechaSolicitud.Value.Year == anioSel
                                                where mesSel == 0 ? true : peticiones.FechaSolicitud.Value.Month == mesSel
                                                select new ObjetoBeneficiarioPeticion
                                                {
                                                    PeticionId = peticiones.PeticionId,
                                                    CiudadnoId = ciudadanos.CiudadanoId,
                                                    Nombre = ciudadanos.NombreCompleto,
                                                    Peticion = peticiones.Descripcion,
                                                    Folio = peticiones.Folio
                                                })
                                });

            return View(BenCatLst);
        }



        /******************************************************************************
         * Beneficiarios de Apoyos los guarda en EXCEL
         ******************************************************************************/
        public DataTable ObtieneBeneficiariosApoyo()
        {
            int LegislaturaId = 2;
            int DiputaoId = 8;
            DataTable dt = new DataTable();
            dt.TableName = "Beneficiarios de Apoyos";

            dt.Columns.Add("Legislatura", typeof(string));                      // 0
            dt.Columns.Add("PeticionID", typeof(int));                          // 1
            dt.Columns.Add("CiudadanoID", typeof(int));                         // 2
            dt.Columns.Add("Nombres", typeof(string));                          // 3    
            dt.Columns.Add("Categoria", typeof(string));                        // 4
            dt.Columns.Add("Subcategoria", typeof(string));                     // 5
            dt.Columns.Add("Descripcion", typeof(string));                      // 6    
            dt.Columns.Add("Folio", typeof(string));                            // 7    
            dt.Columns.Add("RFC", typeof(string));                              // 8
            dt.Columns.Add("CURP", typeof(string));                             // 9    
            dt.Columns.Add("FechaNacimiento", typeof(DateTime));                // 10
            dt.Columns.Add("recordarcumple", typeof(int));                      // 11
            dt.Columns.Add("Genero", typeof(string));                           // 12
            dt.Columns.Add("email", typeof(string));                            // 13
            dt.Columns.Add("telefono", typeof(string));                         // 14
            dt.Columns.Add("Municipio", typeof(string));                        // 15
            dt.Columns.Add("NombreColonia", typeof(string));                    // 16
            dt.Columns.Add("NombreCalle", typeof(string));                      // 17
            dt.Columns.Add("CP", typeof(int));                               // 18
            dt.Columns.Add("NumInterior", typeof(string));                      // 19
            dt.Columns.Add("NumExterior", typeof(string));                      // 20
            dt.Columns.Add("Notas", typeof(string));                            // 21
            dt.Columns.Add("INE_URL", typeof(string));                          // 22
            dt.Columns.Add("Partido", typeof(string));                          // 23
            dt.Columns.Add("Distrito", typeof(string));                         // 24
            dt.Columns.Add("Seccion", typeof(string));                          // 25
            dt.Columns.Add("RCasilla", typeof(int));                            // 26
            dt.Columns.Add("TipoMiembro", typeof(string));                      // 27
            dt.Columns.Add("Afin", typeof(int));                                // 28
            dt.Columns.Add("DDigital", typeof(int));                            // 29
            dt.Columns.Add("Latitud", typeof(string));                          // 30
            dt.Columns.Add("Longitud", typeof(string));                         // 31    


            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpBeneficiarios_Excel";
            cmd.Parameters.Add("@LegislaturaID", System.Data.SqlDbType.Int).Value = LegislaturaId;
            cmd.Parameters.Add("@DiputadoID", System.Data.SqlDbType.Int).Value = DiputaoId;

            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    dt.Rows.Add(
                        query.GetString(0),             // 0 Legislatura
                        query.GetInt32(1),              // 1 PeticionID
                        query.GetInt32(2),              // 2 CiudadanoID
                        query.GetString(3),             // 3 Nombres
                        query.GetString(4),             // 4 Categoria
                        query.GetString(5),             // 5 Subcategoria
                        query.GetString(6),             // 6 Descripcion
                        query.GetString(7),             // 7 Folio
                        query.GetString(8),             // 8 RFC
                        query.GetString(9),             // 9 CURP
                        query.GetDateTime(10),          // 10 FechaNacimiento
                        query.GetInt32(11),             // 11 recordarcumple
                        query.GetString(12),            // 12 Genero
                        query.GetString(13),            // 13 email
                        query.GetString(14),            // 14 telefono
                        query.GetString(15),            // 15 Municipio
                        query.GetString(16),            // 16 NombreColonia
                        query.GetString(17),            // 17 NombreCalle
                        query.GetInt32(18),            // 18 CP
                        query.GetString(19),            // 19 NumInterior
                        query.GetString(20),            // 20 NumExterior
                        query.GetString(21),            // 21 Notas
                        query.GetString(22),            // 22 INE_URL
                        query.GetString(23),            // 23 Partido
                        query.GetString(24),            // 24 Distrito
                        query.GetString(25),            // 25 Seccion
                        query.GetInt32(26),             // 26 RCasilla
                        query.GetString(27),            // 27 TipoMiembro
                        query.GetInt32(28),             // 28 Afin
                        query.GetInt32(29),             // 29 DDigital
                        query.GetString(30),            // 30 Latitud
                        query.GetString(31)             // 31 Longitud
                    );
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return dt;
        }

        /***********************************************************************
         *  Excel Lista Asistentes a Evento
         ***********************************************************************/
        public ActionResult BeneficiariosApoyoToExcel()
        {
            DataTable dt = this.ObtieneBeneficiariosApoyo();
            string fileName = "BeneficiariosApoyos.xlsx";
            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
                }
            }
        }

        /*
        SELECT 
			ISNULL(Leg.Nombre,'') AS Legislatura,
			P.PeticionID, 
			Ciud.CiudadanoID, 
			ISNULL(Ciud.NombreCompleto,'') AS Nombre, 
			ISNULL((SELECT STRING_AGG ( Ca.Descripcion, ',') FROM PeticionCategoria AS PC LEFT JOIN Categorias AS Ca ON Ca.CategoriaID = PC.CategoriaID  WHERE PeticionID = P.PeticionID),'') AS Categoria,
			ISNULL((SELECT STRING_AGG ( SCa.Descripcion, ',') FROM PeticionSubcategoria AS PSC LEFT JOIN Subcategorias AS SCa ON SCa.SubcategoriasID = PSC.SubcategoriaID  WHERE PeticionID = P.PeticionID),'') AS Subcategoria,
			ISNULL(P.Descripcion,'') AS Descripcion, 
			ISNULL(P.Folio,'') AS Folio,
			ISNULL(Ciud.RFC,'') AS RFC,
			ISNULL(Ciud.CURP,'') AS CURP,
			Ciud.FechaNacimiento,
			Ciud.recordarcumple,
			ISNULL(Ciud.Genero,'') AS Genero,
			ISNULL(Ciud.email,'') AS email,
			ISNULL(Ciud.telefono,'') AS Telefono,
			Ciud.MunicipioID,
			ISNULL(Col.NombreColonia,'') AS Colonia,
			ISNULL(Calle.NombreCalle,'') AS Calle,
			ISNULL(Ciud.CP,'') AS CP,
			ISNULL(Ciud.NumInterior,'') AS NumeroInterior,
			ISNULL(Ciud.NumExterior,'') AS NumeroExterior,
			ISNULL(Ciud.Notas,'') AS Notas,
			ISNULL(Ciud.INE_URL,'') AS INE_URL,
			ISNULL(Ciud.Partido,'') AS Partido,
			ISNULL(Ciud.Distrito,'') AS Distrito,
			ISNULL(Ciud.Seccion,'') AS Seccion,
			Ciud.RCasilla,
			ISNULL(Ciud.TipoMiembro,'') AS Miembro,
			Ciud.Afin,
			Ciud.DDigital,
			ISNULL(Ciud.Latitud,'') AS Latitud,
			ISNULL(Ciud.Longitud,'') AS Longitud
        FROM Beneficiarios AS B
        LEFT JOIN  PETICIONES AS P ON P.PeticionID = B.PeticionID
        LEFT JOIN Ciudadanos AS Ciud ON Ciud.CiudadanoID = B.CiudadanoID
		LEFT JOIN Colonias AS Col ON Col.ColoniaID = Ciud.ColoniaID
		LEFT JOIN Calles AS Calle ON Calle.CalleID = Ciud.CalleID
		LEFT JOIN Legislatura AS Leg ON Leg.LegislaturaID = P.LegislaturaID
        --WHERE P.LegislaturaID = 2 AND P.DiputadoID = 8 
		ORDER BY P.FechaSolicitud


        create index peticiones_categoria
on PeticionCategoria(PeticionID);

        create index beneficiarios_peticiones
on beneficiarios(PeticionID);

        DBCC FREEPROCCACHE WITH NO_INFOMSGS;

        */

        /********************************************************************
               O B J E T O S
         *********************************************************************/
        public partial class ObjetoCategoriaSubCategoria
        {
            public int PeticionCategoriaID { get; set; }
            public int CategoriaID { get; set; }
            public string DescripcionCat { get; set; }
            public int PeticionSubcategoriaID { get; set; }
            public int SubcategoriasID { get; set; }
            public string DescripcionSubcat { get; set; }
        }

        public partial class ObjetoArchivos
        {
            public int ArchivosPeticionesID { get; set; }
            public int PeticionID { get; set; }
            public string NombreArchivo { get; set; }
            public string URL { get; set; }
        }

        public partial class ObjetoBeneficiarios
        {
            public int BeneficiariosID { get; set; }
            public int CiudadanoID { get; set; }
            public string NombreCompleto { get; set; }
            public string Colonia { get; set; }
            public string Calle { get; set; }
            public int PeticionID { get; set; }
            public string Notas { get; set; }
            public int Estatus { get; set; }
            public string Latitud { get; set; }
            public string Longitud { get; set; }
        }
        public partial class ObjetoEstatusPeticiones
        {
            public int estatusId { get; set; }
            public string estatus { get; set; }
            public int cantidad { get; set; }
        }
        public partial class ObjetoClasificacionEstatusApoyo
        {
            public int CategoriaId { get; set; }
            public string Categoria { get; set; }
            public int SubcategoriaId { get; set; }
            public string Subcategoria { get; set; }
            public int SinClasificacion { get; set; }
            public int Solicitado { get; set; }
            public int Cancelado { get; set; }
            public int Entregado { get; set; }
            public int Rechazado { get; set; }
            public int Total { get; set; }
            public int Beneficiarios { get; set; }
        }

        public partial class ObjetoPeticion
        {
            public int PeticionId { get; set; }
            public int? AsociacionId { get; set; }
            public string AsociacionNombre { get; set; }
            public string Folio { get; set; }
            public DateTime? FechaSolicitud { get; set; }
            public DateTime? FechaCompromiso { get; set; }
            public DateTime? FechaConclusion { get; set; }
            public string Descripcion { get; set; }
            public int? OrigenPeticionId { get; set; }
            public string OrigenPeticionNombre { get; set; }
            public int? DependeciaId { get; set; }
            public string DependenciaNombre { get; set; }
            public int? Estatus { get; set; }
            public string EstatusDescripcion { get; set; }
            public int? Hito { get; set; }
            public float? Costo { get; set; }
            public string NombreResponsable { get; set; }
            public int? SolicitanteId { get; set; }
            public string SolicitanteNombre { get; set; }
        }

        public partial class ObjetoAvanceXsemana
        {
            public int Anio { get; set; }
            public string Mes { get; set; }
            public int NumeroSemana { get; set; }
            public int RegistradaEnSemana { get; set; }
            public int ConcluidaEnSemana { get; set; }
            public int ProcesoAcumuladas { get; set; }
            public int ConcluidasAcumulada { get; set; }
            public int Total { get; set; }
            public DateTime FechaInicioSemana { get; set; }
            public DateTime FechaFinSemana { get; set; }

        }

        public partial class ObjetoCostoPeticion
        {
            public int CategoriaId { get; set; }
            public string Categoria { get; set; }
            public string Costo { get; set; }
        }
    }
}